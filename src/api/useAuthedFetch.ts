import { useAuth } from '../context/AuthContext';
import { API_BASE } from './api';

/**
 * Returns a fetch function that automatically adds the Authorization header if a token is present.
 */
export function useAuthedFetch() {
  const { token } = useAuth();
  return (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(`${API_BASE}${path}`, { ...init, headers });
  };
}
