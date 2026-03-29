// It is adapted from the official Firebase documentation.
// https://firebase.google.com/docs/web/setup
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey:  "AIzaSyDueT_wkAOfgMCATixd63HVETrcXIZMDMU",
  authDomain:  "studio-3704992952-1479e.firebaseapp.com",
  databaseURL: "https://studio-3704992952-1479e-default-rtdb.firebaseio.com",
  projectId:"studio-3704992952-1479e",
  storageBucket:  "studio-3704992952-1479e.firebasestorage.app",
  messagingSenderId: "860698344863",
  appId: "1:860698344863:web:95106ba8aa08f188f151aa"
};

// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export default firebaseApp;
