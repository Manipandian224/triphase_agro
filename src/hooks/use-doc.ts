'use client';

import { useEffect, useState, useRef } from 'react';
import { onSnapshot, DocumentReference, doc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useDoc<T>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Using a ref to store the unsubscribe function
  const unsubscribeRef = useRef<() => void | undefined>();

  useEffect(() => {
    // If the ref is null, do nothing
    if (!ref) {
      setLoading(false);
      return;
    }

    // Unsubscribe from the previous listener if the ref changes
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.data() as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);

        const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    // Store the new unsubscribe function
    unsubscribeRef.current = unsubscribe;

    // Cleanup function to unsubscribe when the component unmounts or ref changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [ref?.path]); // Depend on the path to re-subscribe if the document changes

  return { data, loading, error };
}
