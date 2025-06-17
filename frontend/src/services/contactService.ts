import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Contact } from '../types';

const CONTACTS_COLLECTION = 'contacts';

// Buscar todos os contatos
export const getContacts = async (): Promise<Contact[]> => {
  const contactsRef = collection(db, CONTACTS_COLLECTION);
  const q = query(contactsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return ({
      id: doc.id,
      name: data.name,
      phone: data.phone,
      message: data.message,
      createdAt: data.createdAt,
    } as unknown) as Contact;
  });
};

// Buscar contato por ID
export const getContactById = async (id: string): Promise<Contact | null> => {
  const docRef = doc(db, CONTACTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return ({
    id: docSnap.id,
    name: data.name,
    phone: data.phone,
    message: data.message,
    createdAt: data.createdAt,
  } as unknown) as Contact;
};

// Criar novo contato
export const createContact = async (
  contactData: Omit<Contact, 'id' | 'createdAt'>
): Promise<Contact> => {
  const contactsRef = collection(db, CONTACTS_COLLECTION);
  const contactWithTimestamp = {
    ...contactData,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(contactsRef, contactWithTimestamp);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return ({
    id: docRef.id,
    name: data!.name,
    phone: data!.phone,
    message: data!.message,
    createdAt: data!.createdAt,
  } as unknown) as Contact;
};

// Deletar contato
export const deleteContact = async (id: string): Promise<void> => {
  const docRef = doc(db, CONTACTS_COLLECTION, id);
  await deleteDoc(docRef);
}; 