'use client';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Functions, getFunctions } from 'firebase/functions';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import firebaseApp from './config';

type FirebaseServices = {
  auth: Auth;
  db: Firestore;
  functions: Functions;
  storage: FirebaseStorage;
};

let services: FirebaseServices | null = null;

export const initializeFirebase = () => {
  if (services) {
    return services;
  }

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const functions = getFunctions(firebaseApp);
  const storage = getStorage(firebaseApp);

  services = { auth, db, functions, storage };
  return services;
};
