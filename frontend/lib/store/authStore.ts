import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';
import { authApi } from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  setAuth: (authData: AuthResponse) => void;
  clearAuth: () => void;
  fetchCurrentUser: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (authData: AuthResponse) => {
        const { user, accessToken, refreshToken } = authData;

        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      clearAuth: () => {
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const authData = await authApi.login(credentials);
          get().setAuth(authData);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isAuthenticated: false,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const authData = await authApi.register(credentials);
          get().setAuth(authData);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            error: errorMessage,
            isAuthenticated: false,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        get().clearAuth();

        // Redirect to homepage
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });

        try {
          const user = await authApi.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
          get().clearAuth();
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
