import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCi7KfKFjSBOL-RfionoznfhHYJLzugFsg",
  authDomain: "enef-clinic.firebaseapp.com",
  projectId: "enef-clinic",
  storageBucket: "enef-clinic.firebasestorage.app",
  messagingSenderId: "63068545805",
  appId: "1:63068545805:web:a3237b155bd1ad677d0644",
  measurementId: "G-YQNJNYMYBW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
