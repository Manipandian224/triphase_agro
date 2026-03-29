export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

const formatMessage = (context: SecurityRuleContext) => {
  return `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(context, null, 2)}`;
};

export class FirestorePermissionError extends Error {
  constructor(context: SecurityRuleContext) {
    super(formatMessage(context));
    this.name = 'FirestorePermissionError';
    // This is to make the error message more readable in the console.
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
