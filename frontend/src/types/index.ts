export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  fuelType: string;
  transmission: string;
  description: string;
  imageUrls: string[];
  images?: File[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: number;
  name: string;
  phone: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
} 