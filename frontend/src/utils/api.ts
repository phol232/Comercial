import { authToken } from '@/stores/authStore';
import { API_URL } from '@/config/api';

export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = authToken.get();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    authToken.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }

  return response;
};
