'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error(error); // Also log the raw error for inspection
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Check the console for details.',
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.removeListener('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
