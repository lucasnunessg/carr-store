import type { Car, Contact } from '../types';

const CARS_KEY = 'broker-store-cars';
const CONTACTS_KEY = 'broker-store-contacts';

// Função auxiliar para gerar IDs únicos
const generateId = () => Date.now().toString();

// Função para converter File para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Função para converter base64 para URL
const base64ToUrl = (base64: string): string => {
  return base64;
};

export const getCars = async (filters?: any): Promise<Car[]> => {
  const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
  
  if (!filters) return cars;

  return cars.filter((car: Car) => {
    if (filters.brand && !car.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
    if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
    if (filters.minPrice && car.price < filters.minPrice) return false;
    if (filters.maxPrice && car.price > filters.maxPrice) return false;
    return true;
  });
};

export const createCar = async (formData: FormData): Promise<Car> => {
  const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
  
  const imageFiles = formData.getAll('images') as File[];
  const imagePromises = imageFiles.map(fileToBase64);
  const imageUrls = await Promise.all(imagePromises);

  const newCar: Car = {
    id: parseInt(generateId()),
    brand: formData.get('brand') as string,
    model: formData.get('model') as string,
    year: parseInt(formData.get('year') as string),
    price: parseFloat(formData.get('price') as string),
    mileage: parseInt(formData.get('mileage') as string),
    color: formData.get('color') as string,
    fuelType: formData.get('fuelType') as string,
    transmission: formData.get('transmission') as string,
    description: formData.get('description') as string,
    imageUrls: imageUrls,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  cars.push(newCar);
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
  return newCar;
};

export const updateCar = async (id: number, formData: FormData): Promise<Car> => {
  const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
  const index = cars.findIndex((car: Car) => car.id === id);
  
  if (index === -1) throw new Error('Car not found');

  const imageFiles = formData.getAll('images') as File[];
  const imagePromises = imageFiles.map(fileToBase64);
  const imageUrls = await Promise.all(imagePromises);

  const updatedCar: Car = {
    ...cars[index],
    brand: formData.get('brand') as string,
    model: formData.get('model') as string,
    year: parseInt(formData.get('year') as string),
    price: parseFloat(formData.get('price') as string),
    mileage: parseInt(formData.get('mileage') as string),
    color: formData.get('color') as string,
    fuelType: formData.get('fuelType') as string,
    transmission: formData.get('transmission') as string,
    description: formData.get('description') as string,
    imageUrls: imageUrls.length > 0 ? imageUrls : cars[index].imageUrls,
    updatedAt: new Date().toISOString(),
  };

  cars[index] = updatedCar;
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
  return updatedCar;
};

export const deleteCar = async (id: number): Promise<void> => {
  const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
  const filteredCars = cars.filter((car: Car) => car.id !== id);
  localStorage.setItem(CARS_KEY, JSON.stringify(filteredCars));
};

export const getContacts = async (): Promise<Contact[]> => {
  return JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
};

export const createContact = async (contact: Partial<Contact>): Promise<Contact> => {
  const contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
  
  const newContact: Contact = {
    id: parseInt(generateId()),
    name: contact.name || '',
    phone: contact.phone || '',
    message: contact.message || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  contacts.push(newContact);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return newContact;
};

export const deleteContact = async (id: number): Promise<void> => {
  const contacts = JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
  const filteredContacts = contacts.filter((contact: Contact) => contact.id !== id);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(filteredContacts));
}; 