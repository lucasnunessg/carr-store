import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface BrokerStoreDB extends DBSchema {
  cars: {
    key: number;
    value: {
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
    indexes: { 'by-brand': string; 'by-model': string; 'by-price': number };
  };
  contacts: {
    key: number;
    value: {
      id: number;
      name: string;
      phone: string;
      message: string;
      createdAt: string;
    };
  };
}

class DatabaseService {
  private db: IDBPDatabase<BrokerStoreDB> | null = null;
  private readonly DB_NAME = 'broker-store-db';
  private readonly VERSION = 1;

  async init() {
    if (this.db) return this.db;

    this.db = await openDB<BrokerStoreDB>(this.DB_NAME, this.VERSION, {
      upgrade(db) {
        // Criar store de carros
        const carStore = db.createObjectStore('cars', { keyPath: 'id', autoIncrement: true });
        carStore.createIndex('by-brand', 'brand');
        carStore.createIndex('by-model', 'model');
        carStore.createIndex('by-price', 'price');

        // Criar store de contatos
        db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
      },
    });

    return this.db;
  }

  // Métodos para Carros
  async getCars() {
    const db = await this.init();
    return db.getAll('cars');
  }

  async getCarById(id: number) {
    const db = await this.init();
    return db.get('cars', id);
  }

  async createCar(car: Omit<BrokerStoreDB['cars']['value'], 'id'>) {
    const db = await this.init();
    const id = await db.add('cars', car as any);
    return { ...car, id };
  }

  async updateCar(id: number, car: Partial<BrokerStoreDB['cars']['value']>) {
    const db = await this.init();
    const existingCar = await db.get('cars', id);
    if (!existingCar) return null;

    const updatedCar = { ...existingCar, ...car };
    await db.put('cars', updatedCar);
    return updatedCar;
  }

  async deleteCar(id: number) {
    const db = await this.init();
    await db.delete('cars', id);
    return true;
  }

  // Métodos para Contatos
  async getContacts() {
    const db = await this.init();
    return db.getAll('contacts');
  }

  async createContact(contact: Omit<BrokerStoreDB['contacts']['value'], 'id'>) {
    const db = await this.init();
    const id = await db.add('contacts', contact as any);
    return { ...contact, id };
  }

  async deleteContact(id: number) {
    const db = await this.init();
    await db.delete('contacts', id);
    return true;
  }

  // Método para exportar dados
  async exportData() {
    const db = await this.init();
    const cars = await db.getAll('cars');
    const contacts = await db.getAll('contacts');
    return { cars, contacts };
  }

  // Método para importar dados
  async importData(data: { cars: BrokerStoreDB['cars']['value'][]; contacts: BrokerStoreDB['contacts']['value'][] }) {
    const db = await this.init();
    const tx = db.transaction(['cars', 'contacts'], 'readwrite');

    // Limpar dados existentes
    await tx.objectStore('cars').clear();
    await tx.objectStore('contacts').clear();

    // Importar novos dados
    for (const car of data.cars) {
      await tx.objectStore('cars').add(car);
    }
    for (const contact of data.contacts) {
      await tx.objectStore('contacts').add(contact);
    }

    await tx.done;
  }
}

export const db = new DatabaseService(); 