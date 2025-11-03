// It is adapted from the official Firebase documentation.
// https://firebase.google.com/docs/web/setup
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyACLA8W6-kk0_5rwAqwL9p6eVq3sUqyfSI",
  authDomain: "phaseirrigation.firebaseapp.com",
  projectId: "phaseirrigation",
  storageBucket: "phaseirrigation.appspot.com",
  messagingSenderId: "892382898447",
  appId: "1:892382898447:web:c402e7aa33b3669909367a",
  measurementId: "G-9RZ9F6W644"
};

// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export default firebaseApp;