import type { Context, MiddlewareHandler } from 'hono';

export type AuthUser = {
  id: string;
};

export type AuthVariables = {
  user: AuthUser;
};

const AUTH_HEADER_PREFIX = 'Bearer ';

function getUserIdFromRequest(context: Context): string | null {
  const authorizationHeader = context.req.header('authorization');
  if (authorizationHeader?.startsWith(AUTH_HEADER_PREFIX)) {
    const userIdFromBearerToken = authorizationHeader
      .slice(AUTH_HEADER_PREFIX.length)
      .trim();
    return userIdFromBearerToken.length > 0 ? userIdFromBearerToken : null;
  }

  const userIdHeader = context.req.header('x-user-id');
  return userIdHeader?.trim() ? userIdHeader.trim() : null;
}

export const requireUser: MiddlewareHandler<{ Variables: AuthVariables }> = async (
  context,
  next,
) => {
  const userId = getUserIdFromRequest(context);
  if (!userId) {
    return context.json(
      {
        error: 'UNAUTHORIZED',
        message:
          'Missing user identity. Provide Authorization: Bearer <userId> or X-User-Id: <userId>.',
      },
      401,
    );
  }

  context.set('user', { id: userId });
  await next();
};

