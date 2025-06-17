import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Car } from '../types';

const CARS_COLLECTION = 'cars';

// Função para converter File em URL
const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `cars/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Buscar todos os carros
export const getCars = async (): Promise<Car[]> => {
  const carsRef = collection(db, CARS_COLLECTION);
  const q = query(carsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return ({
      id: doc.id,
      brand: data.brand,
      model: data.model,
      year: data.year,
      price: data.price,
      description: data.description,
      mileage: data.mileage,
      fuelType: data.fuelType,
      transmission: data.transmission,
      color: data.color,
      imageUrls: data.imageUrls || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as unknown) as Car;
  });
};

// Buscar carro por ID
export const getCarById = async (id: string): Promise<Car | null> => {
  const docRef = doc(db, CARS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return ({
    id: docSnap.id,
    brand: data.brand,
    model: data.model,
    year: data.year,
    price: data.price,
    description: data.description,
    mileage: data.mileage,
    fuelType: data.fuelType,
    transmission: data.transmission,
    color: data.color,
    imageUrls: data.imageUrls || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as unknown) as Car;
};

// Criar novo carro
export const createCar = async (
  carData: Omit<Car, 'id' | 'imageUrls' | 'createdAt' | 'updatedAt'>,
  imageFile?: File
): Promise<Car> => {
  const carsRef = collection(db, CARS_COLLECTION);
  let imageUrls: string[] = [];

  if (imageFile) {
    const imageUrl = await uploadImage(imageFile);
    imageUrls = [imageUrl];
  }

  const carWithTimestamps = {
    ...carData,
    imageUrls,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(carsRef, carWithTimestamps);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return ({
    id: docRef.id,
    brand: data!.brand,
    model: data!.model,
    year: data!.year,
    price: data!.price,
    description: data!.description,
    mileage: data!.mileage,
    fuelType: data!.fuelType,
    transmission: data!.transmission,
    color: data!.color,
    imageUrls: data!.imageUrls || [],
    createdAt: data!.createdAt,
    updatedAt: data!.updatedAt,
  } as unknown) as Car;
};

// Atualizar carro
export const updateCar = async (
  id: string,
  carData: Partial<Omit<Car, 'id' | 'imageUrls' | 'createdAt' | 'updatedAt'>>,
  imageFile?: File
): Promise<Car> => {
  const docRef = doc(db, CARS_COLLECTION, id);
  const updateData: any = {
    ...carData,
    updatedAt: Timestamp.now(),
  };

  if (imageFile) {
    const imageUrl = await uploadImage(imageFile);
    const docSnap = await getDoc(docRef);
    const currentData = docSnap.data();
    const currentImageUrls = currentData?.imageUrls || [];
    updateData.imageUrls = [...currentImageUrls, imageUrl];
  }

  await updateDoc(docRef, updateData);
  const updatedDoc = await getDoc(docRef);
  const data = updatedDoc.data();

  return ({
    id: updatedDoc.id,
    brand: data!.brand,
    model: data!.model,
    year: data!.year,
    price: data!.price,
    description: data!.description,
    mileage: data!.mileage,
    fuelType: data!.fuelType,
    transmission: data!.transmission,
    color: data!.color,
    imageUrls: data!.imageUrls || [],
    createdAt: data!.createdAt,
    updatedAt: data!.updatedAt,
  } as unknown) as Car;
};

// Deletar carro
export const deleteCar = async (id: string): Promise<void> => {
  const docRef = doc(db, CARS_COLLECTION, id);
  await deleteDoc(docRef);
}; 