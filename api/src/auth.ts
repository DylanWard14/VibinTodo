import bcrypt from 'bcrypt';
import { sign, verify } from 'hono/jwt';
import type { Context, MiddlewareHandler } from 'hono';
import { createUser, findUserByEmail } from './usersStore';

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
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const firstName = typeof body?.firstName === 'string' ? body.firstName.trim() : '';
  const lastName = typeof body?.lastName === 'string' ? body.lastName.trim() : '';

  if (!email || !password || !firstName || !lastName) {
    return context.json(
      { error: 'BAD_REQUEST', message: 'Email, password, first name, and last name are required.' },
      400,
    );
  }

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
    { sub: user.id, email: user.email },
    getJwtSecret(),
    'HS256',
  );
  return context.json({ token }, 201);
}

export async function loginHandler(context: Context): Promise<Response> {
  const body = await context.req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    return context.json(
      { error: 'BAD_REQUEST', message: 'Email and password are required.' },
      400,
    );
  }

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
    { sub: user.id, email: user.email },
    getJwtSecret(),
    'HS256',
  );
  return context.json({ token });
}
