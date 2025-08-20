import { create } from 'zustand';
import { api } from '../utils/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      set({
        user: response.data.user, 
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur de connexion';
      set({
        error: errorMessage, 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours nettoyer l'état local
    set({
      user: null,
      isAuthenticated: false,
        error: null
    });
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/api/auth/me');
    set({
        user: response.data.user, 
      isAuthenticated: true,
        error: null
    });
    return true;
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null
      });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters
  getUser: () => get().user,
  getIsAuthenticated: () => get().isAuthenticated,
  getIsLoading: () => get().isLoading,
  getError: () => get().error,
  getRole: () => get().user?.role || null,

  // Vérifications de permissions
  hasRole: (role) => {
    const user = get().user;
    return user?.role === role;
  },

  hasAnyRole: (roles) => {
    const user = get().user;
    return Array.isArray(roles) ? roles.includes(user?.role) : user?.role === roles;
  },

  can: (resource, action) => {
    const user = get().user;
    if (!user) return false;
    
    // Admin a tous les droits
    if (user.role === 'admin') return true;
    
    // Permissions par rôle
    const rolePermissions = {
      manager: {
        chantiers: ['read', 'create', 'update', 'delete_created_only'],
        factures: ['read', 'create', 'update'],
        reglements: ['read', 'create', 'update'],
        imports: ['read', 'create', 'preview', 'integrer'],
        lettrages: ['read', 'create']
      },
      user: {
        chantiers: ['read'],
        factures: ['read'],
        reglements: ['read'],
        imports: ['read'],
        lettrages: ['read']
      },
      viewer: {
        chantiers: ['read'],
        factures: ['read'],
        reglements: ['read'],
        imports: ['read'],
        lettrages: ['read']
      }
    };
    
    const userPermissions = rolePermissions[user.role] || {};
    const resourcePermissions = userPermissions[resource] || [];
    
    return resourcePermissions.includes(action);
  }
})); 