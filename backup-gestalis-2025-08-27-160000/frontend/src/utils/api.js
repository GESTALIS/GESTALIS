import axios from 'axios';

let refreshing = null;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  withCredentials: true,
});

// Intercepteur de réponse pour gérer le refresh automatique
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;
      
      // Anti-race : une seule requête de refresh à la fois
      refreshing = refreshing ?? api.post('/auth/refresh')
        .finally(() => { 
          refreshing = null; 
        });
      
      await refreshing;
      return api(config);
    }
    
    throw error;
  }
);

// Configuration des en-têtes par défaut
api.defaults.headers.common['Content-Type'] = 'application/json';

// Fonction utilitaire pour ajouter une clé d'idempotency
export const addIdempotencyKey = (config, key) => {
  if (key) {
    config.headers['Idempotency-Key'] = key;
  }
  return config;
};

// Fonction utilitaire pour générer une clé d'idempotency
export const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Configuration des timeouts
api.defaults.timeout = 30000; // 30 secondes
api.defaults.timeoutErrorMessage = 'La requête a pris trop de temps';

export default api;
