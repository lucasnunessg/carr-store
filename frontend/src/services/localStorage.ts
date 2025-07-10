import type { Car, Contact } from '../types';
import { db } from './db';

// Tipos locais para compatibilidade com IndexedDB
type LocalCar = {
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
};

type LocalContact = {
  id: number;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
};

// Função para converter LocalCar para Car
const convertLocalCarToCar = (localCar: LocalCar): Car => ({
  _id: localCar.id.toString(),
  brand: localCar.brand,
  model: localCar.model,
  year: localCar.year,
  price: localCar.price,
  description: localCar.description,
  imageUrls: localCar.imageUrls,
  mileage: localCar.mileage,
  color: localCar.color,
  fuelType: localCar.fuelType,
  transmission: localCar.transmission,
  createdAt: localCar.createdAt,
  updatedAt: localCar.updatedAt,
});

// Função para converter LocalContact para Contact
const convertLocalContactToContact = (localContact: LocalContact): Contact => ({
  _id: localContact.id.toString(),
  name: localContact.name,
  email: 'contato@carsstore.com', // Email padrão
  phone: localContact.phone,
  message: localContact.message,
  createdAt: localContact.createdAt,
  updatedAt: localContact.createdAt,
});

// Funções para gerenciar carros
export const getCars = async (): Promise<Car[]> => {
  try {
    const localCars = await db.getCars();
    return localCars.map(convertLocalCarToCar);
  } catch (error) {
    console.error('Erro ao buscar carros:', error);
    return [];
  }
};

export const getCarById = async (id: number): Promise<Car | null> => {
  try {
    const localCar = await db.getCarById(id);
    return localCar ? convertLocalCarToCar(localCar) : null;
  } catch (error) {
    console.error('Erro ao buscar carro:', error);
    return null;
  }
};

export const createCar = async (car: Omit<Car, '_id'>): Promise<Car> => {
  try {
    const localCar = await db.createCar(car as any);
    return convertLocalCarToCar(localCar);
  } catch (error) {
    console.error('Erro ao criar carro:', error);
    throw error;
  }
};

export const updateCar = async (id: number, car: Partial<Car>): Promise<Car | null> => {
  try {
    const localCar = await db.updateCar(id, car as any);
    return localCar ? convertLocalCarToCar(localCar) : null;
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    throw error;
  }
};

export const deleteCar = async (id: number): Promise<boolean> => {
  try {
    return await db.deleteCar(id);
  } catch (error) {
    console.error('Erro ao deletar carro:', error);
    throw error;
  }
};

// Funções para gerenciar contatos
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const localContacts = await db.getContacts();
    return localContacts.map(convertLocalContactToContact);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    return [];
  }
};

export const createContact = async (contact: Omit<Contact, '_id'>): Promise<Contact> => {
  try {
    const localContact = await db.createContact(contact as any);
    return convertLocalContactToContact(localContact);
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    throw error;
  }
};

export const deleteContact = async (id: number): Promise<boolean> => {
  try {
    return await db.deleteContact(id);
  } catch (error) {
    console.error('Erro ao deletar contato:', error);
    throw error;
  }
};

// Funções para backup e restauração
export const exportData = async () => {
  try {
    return await db.exportData();
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    throw error;
  }
};

export const importData = async (data: { cars: Car[]; contacts: Contact[] }) => {
  try {
    // Converter Car[] para LocalCar[]
    const localCars = data.cars.map(car => ({
      id: parseInt(car._id),
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      description: car.description,
      imageUrls: car.imageUrls,
      mileage: car.mileage,
      color: car.color,
      fuelType: car.fuelType,
      transmission: car.transmission,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
    }));

    // Converter Contact[] para LocalContact[]
    const localContacts = data.contacts.map(contact => ({
      id: parseInt(contact._id),
      name: contact.name,
      phone: contact.phone,
      message: contact.message,
      createdAt: contact.createdAt,
    }));

    await db.importData({ cars: localCars, contacts: localContacts });
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    throw error;
  }
};
