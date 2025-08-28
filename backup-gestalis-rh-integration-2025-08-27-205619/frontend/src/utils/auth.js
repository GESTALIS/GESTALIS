import axios from 'axios';

// Configuration de l'API GESTALIS
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Instance axios configurée
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 (non autorisé) et qu'on n'a pas déjà tenté de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentative de rafraîchissement du token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // Retry de la requête originale
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnexion
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Fonctions d'authentification
export const authAPI = {
  // Connexion
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      // Stockage des informations d'authentification
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  // Inscription
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Stockage des informations d'authentification
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      // Nettoyage du stockage local
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Vérification du token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      throw error;
    }
  },

  // Récupération du profil utilisateur
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile/me');
      return response.data;
    } catch (error) {
      console.error('Erreur de récupération du profil:', error);
      throw error;
    }
  },

  // Mise à jour du profil
  updateProfile: async (profileData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.put(`/users/${user.id}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      throw error;
    }
  },

  // Changement de mot de passe
  changePassword: async (currentPassword, newPassword) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await api.put(`/users/${user.id}/password`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Erreur de changement de mot de passe:', error);
      throw error;
    }
  }
};

// Fonctions utilitaires
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erreur de parsing du profil utilisateur:', error);
    return null;
  }
};

export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const roleHierarchy = {
    'viewer': 1,
    'user': 2,
    'manager': 3,
    'admin': 4
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

export const hasAnyRole = (requiredRoles) => {
  return requiredRoles.some(role => hasRole(role));
};

export default api;