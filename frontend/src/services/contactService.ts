import api from './api';
import type { Contact } from '../types';

const CONTACTS_STORAGE_KEY = 'contacts';

// Função auxiliar para gerar IDs únicos
const generateId = () => Math.random().toString(36).substr(2, 9);

// Buscar todos os contatos
export const getContacts = async (): Promise<Contact[]> => {
  const response = await api.get<Contact[]>('/contacts');
  return response.data;
};

// Buscar contato por ID
export const getContactById = async (id: string): Promise<Contact> => {
  const response = await api.get<Contact>(`/contacts/${id}`);
  return response.data;
};

// Criar novo contato
export const createContact = async (contactData: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>): Promise<Contact> => {
  const response = await api.post<Contact>('/contacts', contactData);
  return response.data;
};

// Atualizar contato
export const updateContact = async (
  id: string,
  contactData: Partial<Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<Contact> => {
  const response = await api.put<Contact>(`/contacts/${id}`, contactData);
  return response.data;
};

// Deletar contato
export const deleteContact = async (id: string): Promise<void> => {
  await api.delete(`/contacts/${id}`);
}; 