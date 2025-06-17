import type { Car, Contact } from '../types';
import { db } from './db';

// Funções para gerenciar carros
export const getCars = async (): Promise<Car[]> => {
  try {
    return await db.getCars();
  } catch (error) {
    console.error('Erro ao buscar carros:', error);
    return [];
  }
};

export const getCarById = async (id: number): Promise<Car | null> => {
  try {
    const car = await db.getCarById(id);
    return car || null;
  } catch (error) {
    console.error('Erro ao buscar carro:', error);
    return null;
  }
};

export const createCar = async (car: Omit<Car, 'id'>): Promise<Car> => {
  try {
    return await db.createCar(car);
  } catch (error) {
    console.error('Erro ao criar carro:', error);
    throw error;
  }
};

export const updateCar = async (id: number, car: Partial<Car>): Promise<Car | null> => {
  try {
    return await db.updateCar(id, car);
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
    return await db.getContacts();
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    return [];
  }
};

export const createContact = async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
  try {
    return await db.createContact(contact);
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
    await db.importData(data);
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    throw error;
  }
};
