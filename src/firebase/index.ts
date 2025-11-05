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

  // Note: This is a sample initialization. In a real app, you'd want to
  // ensure this is only called once.
  if (process.env.NODE_ENV === 'development') {
    // try {
    //   connectAuthEmulator(auth, 'http://localhost:9099');
    //   connectFirestoreEmulator(db, 'localhost', 8080);
    //   connectFunctionsEmulator(functions, 'localhost', 5001);
    //   connectStorageEmulator(storage, 'localhost', 9199);
    // } catch (e) {
    //   console.error('Error connecting to Firebase emulators. Please ensure they are running.', e);
    // }
  }


  services = { auth, db, functions, storage };
  return services;
};
