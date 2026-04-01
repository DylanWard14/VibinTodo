import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
};

function parseToken(token: string): AuthUser {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return {
    id: payload.sub as string,
    email: payload.email as string,
    firstName: payload.firstName as string,
    lastName: payload.lastName as string,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token) => {
        set({ token, user: parseToken(token) });
      },

      clearAuth: () => {
        set({ token: null, user: null });
      },
    }),
    { name: 'auth' },
  ),
);
