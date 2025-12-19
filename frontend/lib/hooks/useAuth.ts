import { useAuthStore } from '@/lib/store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    setError,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    setError,
    isDeveloper: user?.role === 'DEVELOPER',
    isFounder: user?.role === 'FOUNDER',
    isAdmin: user?.role === 'ADMIN',
  };
};

export default useAuth;
