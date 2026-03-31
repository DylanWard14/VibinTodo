export type Todo = {
  id: string;
  text: string;
  createdAt: number;
};

type UserId = string;

const todosByUserId = new Map<UserId, Todo[]>();

const makeId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export function listTodos(userId: string): Todo[] {
  return todosByUserId.get(userId) ?? [];
}

export function createTodo(userId: string, text: string): Todo {
  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error('Todo text is required.');
  }

  const todo: Todo = {
    id: makeId(),
    text: trimmedText,
    createdAt: Date.now(),
  };

  const existingTodos = todosByUserId.get(userId) ?? [];
  todosByUserId.set(userId, [todo, ...existingTodos]);
  return todo;
}

export function deleteTodo(userId: string, todoId: string): boolean {
  const existingTodos = todosByUserId.get(userId) ?? [];
  const filteredTodos = existingTodos.filter((todo) => todo.id !== todoId);
  const wasDeleted = filteredTodos.length !== existingTodos.length;

  todosByUserId.set(userId, filteredTodos);
  return wasDeleted;
}

