// firebase-config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB6x0hKU0RaoL0EEaMlQtmYnBGfRi78_28",
  authDomain: "content-management-syste-e984d.firebaseapp.com",
  databaseURL: "https://content-management-syste-e984d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "content-management-syste-e984d",
  storageBucket: "content-management-syste-e984d.firebasestorage.app",
  messagingSenderId: "424121072751",
  appId: "1:424121072751:web:50256d5fecfba90485619a"
};

export const app = initializeApp(firebaseConfig);