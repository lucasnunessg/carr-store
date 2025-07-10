import api from './api';
import type { Car } from '../types';

// Buscar todos os carros
export const getCars = async (): Promise<Car[]> => {
  const response = await api.get<Car[]>('/cars');
  return response.data;
};

// Buscar carro por ID
export const getCarById = async (id: string): Promise<Car> => {
  const response = await api.get<Car>(`/cars/${id}`);
  return response.data;
};

// Criar novo carro
export const createCar = async (
  carData: Omit<Car, '_id' | 'imageUrls' | 'createdAt' | 'updatedAt'>,
  imageFiles?: File[]
): Promise<Car> => {
  const formData = new FormData();
  
  // Adicionar dados do carro
  Object.entries(carData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  // Adicionar imagens se existirem
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await api.post<Car>('/cars', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// Atualizar carro
export const updateCar = async (
  id: string,
  carData: Partial<Omit<Car, '_id' | 'imageUrls' | 'createdAt' | 'updatedAt'>>,
  imageFiles?: File[]
): Promise<Car> => {
  const formData = new FormData();
  
  // Adicionar dados do carro
  Object.entries(carData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  // Adicionar imagens se existirem
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
  }

  const response = await api.put<Car>(`/cars/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// Deletar carro
export const deleteCar = async (id: string): Promise<void> => {
  console.log('deleteCar chamado com ID:', id);
  console.log('URL da requisição:', `/cars/${id}`);
  const response = await api.delete(`/cars/${id}`);
  console.log('Resposta da deleção:', response);
}; 