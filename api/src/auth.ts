import bcrypt from 'bcrypt';
import { sign, verify } from 'hono/jwt';
import type { Context, MiddlewareHandler } from 'hono';
import { z } from 'zod';
import { createUser, findUserByEmail } from './usersStore';

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthVariables = {
  user: AuthUser;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required.');
  }
  return secret;
}

export const requireUser: MiddlewareHandler<{
  Variables: AuthVariables;
}> = async (context, next) => {
  const authHeader = context.req.header('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : null;

  if (!token) {
    return context.json(
      { error: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header.' },
      401,
    );
  }

  try {
    const payload = await verify(token, getJwtSecret(), 'HS256');
    context.set('user', {
      id: payload.sub as string,
      email: payload.email as string,
    });
    await next();
  } catch {
    return context.json(
      { error: 'UNAUTHORIZED', message: 'Invalid or expired token.' },
      401,
    );
  }
};

export async function registerHandler(context: Context): Promise<Response> {
  const body = await context.req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return context.json(
      { error: 'BAD_REQUEST', message: parsed.error.issues[0].message },
      400,
    );
  }

  const { email, password, firstName, lastName } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return context.json(
      { error: 'CONFLICT', message: 'An account with that email already exists.' },
      409,
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser(email, passwordHash, firstName, lastName);

  const token = await sign(
    { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    getJwtSecret(),
    'HS256',
  );
  return context.json({ token }, 201);
}

export async function loginHandler(context: Context): Promise<Response> {
  const body = await context.req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return context.json(
      { error: 'BAD_REQUEST', message: parsed.error.issues[0].message },
      400,
    );
  }

  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);
  const passwordMatch = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordMatch) {
    return context.json(
      { error: 'UNAUTHORIZED', message: 'Invalid email or password.' },
      401,
    );
  }

  const token = await sign(
    { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    getJwtSecret(),
    'HS256',
  );
  return context.json({ token });
}
