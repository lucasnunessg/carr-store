import type { Car } from '../types';

const API_URL = 'https://broker-store-production.up.railway.app';

export const getCars = async (filters?: any): Promise<Car[]> => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value.toString());
      }
    });
  }
  const response = await fetch(`${API_URL}/cars?${queryParams}`);
  return response.json();
};

export const createCar = async (formData: FormData): Promise<Car> => {
  const response = await fetch(`${API_URL}/cars`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const updateCar = async (id: number, formData: FormData): Promise<Car> => {
  const response = await fetch(`${API_URL}/cars/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  return response.json();
};

export const deleteCar = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/cars/${id}`, {
    method: 'DELETE',
  });
}; 