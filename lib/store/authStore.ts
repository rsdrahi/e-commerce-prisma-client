import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === 'ADMIN',
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  },
  init: () => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          const user: User = JSON.parse(userStr);
          set({
            user,
            token,
            isAuthenticated: true,
            isAdmin: user.role === 'ADMIN',
          });
        }
      } catch {
        // Corrupted localStorage data — clear it and start fresh
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    }
  },
}));
