export interface Car {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  carId?: string;
  createdAt: string;
  updatedAt: string;
  car?: Car;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
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