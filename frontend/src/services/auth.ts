import type { User } from '../types';

const ADMIN_EMAIL = 'umdouglassimoes@gmail.com';
const ADMIN_PASSWORD = 'dodo1252501';

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const user: User = {
      id: 1,
      email: ADMIN_EMAIL,
      name: 'Admin',
      role: 'admin'
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  throw new Error('Invalid credentials');
};

export const logout = (): void => {
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem('user');
  return !!user;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}; 