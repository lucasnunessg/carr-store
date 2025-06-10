import axios from 'axios';
import type { Car, Contact, CarFilters } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getCars = async (filters?: CarFilters) => {
  const response = await api.get<Car[]>('/cars', { params: filters });
  return response.data;
};

export const getCar = async (id: number) => {
  const response = await api.get<Car>(`/cars/${id}`);
  return response.data;
};

export const createCar = async (carData: FormData) => {
  const response = await api.post<Car>('/cars', carData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCar = async (id: number, carData: FormData) => {
  const response = await api.patch<Car>(`/cars/${id}`, carData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCar = async (id: number) => {
  await api.delete(`/cars/${id}`);
};

export const getContacts = async () => {
  const response = await api.get<Contact[]>('/contacts');
  return response.data;
};

export const createContact = async (contact: Partial<Contact>) => {
  const response = await api.post<Contact>('/contacts', contact);
  return response.data;
};

export const deleteContact = async (id: number) => {
  await api.delete(`/contacts/${id}`);
}; 