
'use client';

import { useEffect, useState, useRef } from 'react';
import { onValue, off, DatabaseReference, Query } from 'firebase/database';

export function useRtdbValue<T>(ref: DatabaseReference | Query | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref to store the reference object to avoid re-running the effect
  // if a new but identical reference object is passed.
  const refRef = useRef(ref);
  refRef.current = ref;

  useEffect(() => {
    const currentRef = refRef.current;
    if (!currentRef) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const callback = onValue(
      currentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val() as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
        // Note: You can also integrate with a global error handler here
        // like the FirestorePermissionError system if needed.
      }
    );

    // Cleanup function to remove the listener when the component unmounts
    // or the reference changes.
    return () => {
      off(currentRef, 'value', callback);
    };
  }, [ref?.key]); // Rerun only if the key of the reference changes

  return { data, loading, error };
}

    