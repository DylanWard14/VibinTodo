import { useAuthStore } from '../stores/authStore';

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

function apiHeaders(): HeadersInit {
  const { token } = useAuthStore.getState();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, headers: apiHeaders() });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTodos(): Promise<TodoItem[]> {
  const data = await request<{ todos: TodoItem[] }>('/api/todos');
  return data.todos;
}

export async function createTodo(text: string): Promise<TodoItem> {
  const data = await request<{ todo: TodoItem }>('/api/todos', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  return data.todo;
}

export async function toggleTodo(id: string): Promise<TodoItem> {
  const data = await request<{ todo: TodoItem }>(`/api/todos/${id}/toggle`, {
    method: 'PATCH',
  });
  return data.todo;
}

export async function deleteTodo(id: string): Promise<void> {
  await request(`/api/todos/${id}`, { method: 'DELETE' });
}
