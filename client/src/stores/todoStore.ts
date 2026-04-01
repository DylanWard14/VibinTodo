import { create } from 'zustand';

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type ApiTodo = Omit<TodoItem, 'completed'>;

type TodoState = {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleCompletedStatus: (id: string) => void;
  removeTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
};

function getUserId(): string {
  let userId = localStorage.getItem('todo-user-id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('todo-user-id', userId);
  }
  return userId;
}

function apiHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getUserId()}`,
  };
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/todos', { headers: apiHeaders() });
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data: { todos: ApiTodo[] } = await res.json();
      set({
        todos: data.todos.map((t) => ({ ...t, completed: false })),
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  },

  addTodo: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) throw new Error('Failed to create todo');
      const data: { todo: ApiTodo } = await res.json();
      set({ todos: [{ ...data.todo, completed: false }, ...get().todos] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
  },

  toggleCompletedStatus: (id) => {
    set({
      todos: get().todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    });
  },

  removeTodo: async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: apiHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete todo');
      set({ todos: get().todos.filter((t) => t.id !== id) });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
  },

  clearCompleted: async () => {
    const completed = get().todos.filter((t) => t.completed);
    try {
      await Promise.all(
        completed.map((todo) =>
          fetch(`/api/todos/${todo.id}`, {
            method: 'DELETE',
            headers: apiHeaders(),
          }),
        ),
      );
      set({ todos: get().todos.filter((t) => !t.completed) });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
  },
}));
