import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGnnWVzYuEoG2U4OSa_of_yIVS2plnlEw",
  authDomain: "flash-card-e78b2.firebaseapp.com",
  projectId: "flash-card-e78b2",
  storageBucket: "flash-card-e78b2.appspot.com",
  messagingSenderId: "138787733559",
  appId: "1:138787733559:web:ff7670ea8e4551016b7fb2",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Именованный экспорт
export { app, auth, db };
