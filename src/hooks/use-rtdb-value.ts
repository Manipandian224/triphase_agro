
'use client';

import { useEffect, useState, useRef } from 'react';
import { onValue, off, DatabaseReference, Query } from 'firebase/database';

export function useRtdbValue<T>(ref: DatabaseReference | Query | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const callback = onValue(
      ref,
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
      off(ref, 'value', callback);
    };
  }, [ref]); // Rerun if the reference object itself changes

  return { data, loading, error };
}
