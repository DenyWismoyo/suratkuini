// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyDBjx1eEP4F7b9Z6_dYbaxSwY5sJbm2EfM",
    authDomain: "aplikasikantordigital.firebaseapp.com",
    projectId: "aplikasikantordigital",
    storageBucket: "aplikasikantordigital.appspot.com",
    messagingSenderId: "771864585836",
    appId: "1:771864585836:web:416b572f7802e7338e1a49",
    measurementId: "G-JPYQ7PRPM7"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor service yang akan digunakan di seluruh aplikasi
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
