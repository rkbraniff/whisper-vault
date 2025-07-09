import { useAuth } from '../context/AuthContext';

/**
 * Returns a fetch function that automatically adds the Authorization header if a token is present.
 */
export function useAuthedFetch() {
  const { token } = useAuth();
  return (input: RequestInfo, init: RequestInit = {}) => {
    const headers = new Headers(init.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };
}
