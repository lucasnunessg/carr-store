import type { Contact } from '../types';

const API_URL = 'http://localhost:3000';

export const getContacts = async (): Promise<Contact[]> => {
  const response = await fetch(`${API_URL}/contacts`);
  return response.json();
};

export const deleteContact = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
  });
}; 