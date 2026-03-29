'use client';

import { EventEmitter } from 'events';
import type { SecurityRuleContext } from './errors';

// This is a type-safe event emitter.
// It ensures that we only emit events that we have defined.
interface TypedEventEmitter {
  on(event: 'permission-error', listener: (error: Error) => void): this;
  emit(event: 'permission-error', error: Error): boolean;
}

class TypedEventEmitter extends EventEmitter {}

export const errorEmitter = new TypedEventEmitter();

// Throw uncaught exceptions in the dev overlay.
errorEmitter.on('permission-error', (error) => {
  if (process.env.NODE_ENV === 'development') {
    // We are throwing this error here so that the Next.js dev overlay will show the
    // error message. This is useful for debugging security rules.
    setTimeout(() => {
      throw error;
    });
  }
});
