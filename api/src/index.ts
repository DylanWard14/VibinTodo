import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { requireUser, type AuthVariables } from './auth';
import { createTodo, deleteTodo, listTodos, toggleTodo } from './todosStore';

type Bindings = {
  Variables: AuthVariables;
};

const app = new Hono<Bindings>();

app.use(
  '*',
  cors({
    origin: (requestOrigin) => requestOrigin ?? '*',
    allowHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.get('/health', (context) => {
  return context.json({ ok: true });
});

app.use('/api/*', requireUser);

app.get('/api/todos', async (context) => {
  const user = context.get('user');
  const todos = await listTodos(user.id);
  return context.json({ todos });
});

app.post('/api/todos', async (context) => {
  const user = context.get('user');
  const body = await context.req.json().catch(() => null);

  const text = typeof body?.text === 'string' ? body.text : '';
  try {
    const todo = await createTodo(user.id, text);
    return context.json({ todo }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Invalid request body.';
    return context.json({ error: 'BAD_REQUEST', message }, 400);
  }
});

app.patch('/api/todos/:id/toggle', async (context) => {
  const user = context.get('user');
  const todoId = context.req.param('id');

  const todo = await toggleTodo(user.id, todoId);
  if (!todo) {
    return context.json(
      { error: 'NOT_FOUND', message: 'Todo not found.' },
      404,
    );
  }

  return context.json({ todo });
});

app.delete('/api/todos/:id', async (context) => {
  const user = context.get('user');
  const todoId = context.req.param('id');

  const wasDeleted = await deleteTodo(user.id, todoId);
  if (!wasDeleted) {
    return context.json(
      { error: 'NOT_FOUND', message: 'Todo not found.' },
      404,
    );
  }

  return context.json({ ok: true });
});

const port = Number(process.env.PORT ?? 8787);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`Todo API listening on http://localhost:${info.port}`);
  },
);
