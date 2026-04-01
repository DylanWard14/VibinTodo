import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  toggleTodo,
} from '../api/todos';

const TODOS_KEY = ['todos'];

export function useTodos() {
  return useQuery({ queryKey: TODOS_KEY, queryFn: fetchTodos });
}

export function useAddTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => createTodo(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useRemoveTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}

export function useClearCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => deleteTodo(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
}
