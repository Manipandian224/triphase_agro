// It is adapted from the official Firebase documentation.
// https://firebase.google.com/docs/web/setup
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDuEt_wKAofgMCATixd6HVEtrcXIZMDMU",
  authDomain: "agri-vision-pro.firebaseapp.com",
  databaseURL: "https://agri-vision-pro-default-rtdb.firebaseio.com/",
  projectId: "agri-vision-pro",
  storageBucket: "agri-vision-pro.appspot.com",
  messagingSenderId: "xxxxxxx",
  appId: "1:xxxxxx:web:xxxxxx"
};

// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export default firebaseApp;
