'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Functions } from 'firebase/functions';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

import { initializeFirebase } from './index';

interface FirebaseContextType {
  auth: Auth | null;
  db: Firestore | null;
  functions: Functions | null;
  storage: FirebaseStorage | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth: null,
  db: null,
  functions: null,
  storage: null,
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseServices, setFirebaseServices] =
    useState<FirebaseContextType>({
      auth: null,
      db: null,
      functions: null,
      storage: null,
    });

  useEffect(() => {
    const services = initializeFirebase();
    setFirebaseServices(services);
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseServices}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
