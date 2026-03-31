import { create } from 'zustand'

export type TodoItem = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type TodoState = {
  todos: TodoItem[]
  addTodo: (text: string) => void
  toggleCompletedStatus: (id: string) => void
  removeTodo: (id: string) => void
  clearCompleted: () => void
}

const makeId = () => {
  // `crypto.randomUUID` is available in modern browsers.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],

  addTodo: (text) => {
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    const todo: TodoItem = {
      id: makeId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    }

    set({ todos: [todo, ...get().todos] })
  },

  toggleCompletedStatus: (id) => {
    set({
      todos: get().todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })
  },

  removeTodo: (id) => {
    set({ todos: get().todos.filter((todo) => todo.id !== id) })
  },

  clearCompleted: () => {
    set({ todos: get().todos.filter((todo) => !todo.completed) })
  },
}))
