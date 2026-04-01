import db from './db';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type TodoRow = {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string | number;
};

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
    createdAt: Number(row.created_at),
  };
}

export async function listTodos(userId: string): Promise<Todo[]> {
  const rows = await db<TodoRow>('todos')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc');
  return rows.map(rowToTodo);
}

export async function createTodo(userId: string, text: string): Promise<Todo> {
  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error('Todo text is required.');
  }

  const [row] = await db<TodoRow>('todos')
    .insert({
      id: crypto.randomUUID(),
      user_id: userId,
      text: trimmedText,
      completed: false,
      created_at: Date.now(),
    })
    .returning('*');
  return rowToTodo(row);
}

export async function toggleTodo(
  userId: string,
  todoId: string,
): Promise<Todo | null> {
  const [row] = await db<TodoRow>('todos')
    .where({ id: todoId, user_id: userId })
    .update({ completed: db.raw('NOT completed') })
    .returning('*');
  return row ? rowToTodo(row) : null;
}

export async function deleteTodo(
  userId: string,
  todoId: string,
): Promise<boolean> {
  const count = await db<TodoRow>('todos')
    .where({ id: todoId, user_id: userId })
    .delete();
  return count > 0;
}
