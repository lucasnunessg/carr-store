import type { Car, Contact as ContactBase } from '../types';

const CARS_KEY = 'cars';
const CONTACTS_KEY = 'contacts';

type Contact = ContactBase & {
  updatedAt?: string;
};

const generateId = () => Date.now().toString();
console.log(generateId());

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

console.log(fileToBase64(new File([], 'test.jpg')));

export const getCars = async (): Promise<Car[]> => {
  const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
  return cars;
};

export const getCarById = async (id: number): Promise<Car | null> => {
  const cars = await getCars();
  return cars.find(car => car.id === id) || null;
};

export const createCar = async (car: Omit<Car, 'id'>): Promise<Car> => {
  const cars = await getCars();
  const newCar: Car = {
    ...car,
    id: Date.now(),
  };
  cars.push(newCar);
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
  return newCar;
};

export const updateCar = async (id: number, car: Partial<Car>): Promise<Car | null> => {
  const cars = await getCars();
  const index = cars.findIndex(c => c.id === id);
  if (index === -1) return null;

  const updatedCar: Car = {
    ...cars[index],
    ...car,
  };
  cars[index] = updatedCar;
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
  return updatedCar;
};

export const deleteCar = async (id: number): Promise<boolean> => {
  const cars = await getCars();
  const filteredCars = cars.filter(car => car.id !== id);
  if (filteredCars.length === cars.length) return false;
  
  localStorage.setItem(CARS_KEY, JSON.stringify(filteredCars));
  return true;
};

export const getContacts = (): Contact[] => {
  return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
};

export const createContact = async (contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> => {
  const contacts = getContacts();
  const newContact: Contact = {
    ...contact,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  contacts.push(newContact);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return newContact;
};

export const getContactById = async (id: number): Promise<Contact | null> => {
  const contacts = getContacts();
  return contacts.find(contact => contact.id === id) || null;
};

export const updateContact = async (id: number, contact: Partial<Contact>): Promise<Contact | null> => {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index === -1) return null;

  const updatedContact: Contact = {
    ...contacts[index],
    ...contact,
    updatedAt: new Date().toISOString(),
  };
  contacts[index] = updatedContact;
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return updatedContact;
};

export const deleteContact = async (id: number): Promise<boolean> => {
  const contacts = getContacts();
  const filteredContacts = contacts.filter(contact => contact.id !== id);
  if (filteredContacts.length === contacts.length) return false;
  
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(filteredContacts));
  return true;
};
