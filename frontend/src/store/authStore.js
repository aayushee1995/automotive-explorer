import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Use environment variable or fallback to localhost for development
// For mobile testing, set VITE_API_BASE_URL to your computer's IP address
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Clear user-specific localStorage data
const clearUserData = () => {
  // Clear vehicle store data (favorites, filters)
  localStorage.removeItem('vehicle-store');
  // Clear any other user-specific data as needed
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Register new user
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data;

          // Clear previous user data before setting new user
          clearUserData();

          // Store token for future requests
          localStorage.setItem('authToken', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Registration failed';
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false,
            user: null
          });
          return { success: false, error: errorMessage };
        }
      },

      // Login user
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', credentials);
          const { user, token } = response.data;

          // Clear previous user data before setting new user
          clearUserData();

          // Store token for future requests
          localStorage.setItem('authToken', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Login failed';
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false,
            user: null
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout user
      logout: () => {
        console.log('Logging out user');

        // Clear user-specific data
        clearUserData();

        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });

        // Force a page reload to clear any cached state
        window.location.href = '/';
      },

      // Initialize auth state from stored token
      initializeAuth: async () => {
        set({ loading: true });
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await api.get('/auth/me');
            const { user } = response.data;
            
            set({
              user,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } catch (error) {
            // Token is invalid, remove it
            console.log('Token invalid, clearing auth state');
            clearUserData();
            localStorage.removeItem('authToken');
            delete api.defaults.headers.common['Authorization'];
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          }
        } else {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put('/auth/profile', profileData);
          const { user } = response.data;
          
          set({
            user,
            loading: false,
            error: null,
          });
          
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Profile update failed';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Get user stats (favorite count, activity, etc.)
      getUserStats: () => {
        const { user } = get();
        if (!user) return null;
        
        return {
          joinDate: user.createdAt,
          favoriteCount: user.favoriteCount || 0,
          lastActivity: user.lastActivity || Date.now(),
        };
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook for protected routes
export const useAuthRequired = () => {
  const { isAuthenticated, user } = useAuthStore();
  return { isAuthenticated, user, requiresAuth: !isAuthenticated };
};