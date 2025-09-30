import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import React from 'react';

// Use environment variable or fallback to localhost for development
// For mobile testing, set VITE_API_BASE_URL to your computer's IP address
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const useVehicleStore = create(
  persist(
    (set, get) => ({
      // State
      vehicles: [],
      stats: null,
      loading: false,
      error: null,
      favorites: [],
      filters: {
        search: '',
        cylinders: '',
        origin: '',
        minMpg: '',
        maxMpg: '',
        minYear: '',
        maxYear: '',
        sortBy: 'mpg',
        sortOrder: 'desc',
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
      },

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Fetch vehicles with filtering and pagination
      fetchVehicles: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const { filters, pagination } = get();
          const queryParams = new URLSearchParams({
            ...filters,
            page: pagination.page,
            limit: pagination.limit,
            ...params, // Override with passed params
          });

          // Remove empty values
          for (let [key, value] of queryParams.entries()) {
            if (!value || value === '') {
              queryParams.delete(key);
            }
          }

          const response = await api.get(`/cars?${queryParams}`);
          const { data, total, page, limit } = response.data;

          set({
            vehicles: data,
            pagination: { page, limit, total },
            loading: false,
          });
        } catch (error) {
          set({ 
            error: 'Failed to fetch vehicles', 
            loading: false 
          });
          console.error('Fetch vehicles error:', error);
        }
      },

      // Fetch single vehicle
      fetchVehicle: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/cars/${id}`);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ 
            error: 'Failed to fetch vehicle details', 
            loading: false 
          });
          console.error('Fetch vehicle error:', error);
          return null;
        }
      },

      // Fetch statistics
      fetchStats: async () => {
        try {
          const response = await api.get('/cars/stats');
          set({ stats: response.data });
        } catch (error) {
          console.error('Fetch stats error:', error);
        }
      },

      // Update filters
      updateFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, page: 1 }, // Reset to first page
        }));
      },

      // Clear filters
      clearFilters: () => {
        set({
          filters: {
            search: '',
            cylinders: '',
            origin: '',
            minMpg: '',
            maxMpg: '',
            minYear: '',
            maxYear: '',
            sortBy: 'mpg',
            sortOrder: 'desc',
          },
          pagination: { page: 1, limit: 20, total: 0 },
        });
      },

      // Update pagination
      updatePagination: (newPagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination },
        }));
      },

      // Favorites management
      addToFavorites: (vehicle) => {
        set((state) => {
          if (!state.favorites.find(fav => fav.id === vehicle.id)) {
            return {
              favorites: [...state.favorites, { ...vehicle, addedAt: Date.now() }],
            };
          }
          return state;
        });
      },

      removeFromFavorites: (vehicleId) => {
        set((state) => ({
          favorites: state.favorites.filter(fav => fav.id !== vehicleId),
        }));
      },

      toggleFavorite: (vehicle) => {
        const { favorites } = get();
        const isFavorite = favorites.find(fav => fav.id === vehicle.id);
        
        if (isFavorite) {
          get().removeFromFavorites(vehicle.id);
        } else {
          get().addToFavorites(vehicle);
        }
      },

      isFavorite: (vehicleId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === vehicleId);
      },

      // Clear all data (useful for refresh)
      clearData: () => {
        set({
          vehicles: [],
          stats: null,
          error: null,
          pagination: { page: 1, limit: 20, total: 0 },
        });
      },
    }),
    {
      name: 'vehicle-store', // Key in localStorage
      partialize: (state) => ({ 
        favorites: state.favorites, // Only persist favorites
        filters: state.filters, // And current filters
      }),
    }
  )
);

// Query hook for React Query-like functionality
export const useVehicleQuery = (id) => {
  const fetchVehicle = useVehicleStore(state => state.fetchVehicle);
  const loading = useVehicleStore(state => state.loading);
  const error = useVehicleStore(state => state.error);
  
  const [vehicle, setVehicle] = React.useState(null);
  
  React.useEffect(() => {
    if (id) {
      fetchVehicle(id).then(setVehicle);
    }
  }, [id, fetchVehicle]);
  
  return { vehicle, loading, error };
};