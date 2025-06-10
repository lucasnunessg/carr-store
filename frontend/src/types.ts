export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  imageUrls: string[];
  mileage: number;
  color: string;
  fuelType: string;
  transmission: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

export interface Contact {
  id: number;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
} 