import { atom } from 'nanostores';

export const authToken = atom<string | null>(
  typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
);

export const setToken = (token: string) => {
  authToken.set(token);
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const logout = () => {
  authToken.set(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
  window.location.href = '/login';
};
