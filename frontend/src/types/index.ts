import { Timestamp } from 'firebase/firestore';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  imageUrls: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: Timestamp;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
} 