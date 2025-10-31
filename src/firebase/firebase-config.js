// firebase-config.js
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyAjtS5wT_NDvE2N2eogY6GLAHMET-LgxN0",
  authDomain: "web-novel-application.firebaseapp.com",
  projectId: "web-novel-application",
  storageBucket: "web-novel-application.firebasestorage.app",
  messagingSenderId: "317531130381",
  appId: "1:317531130381:web:a06db4be50371911486344",
  databaseURL: "https://web-novel-application-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
const provider = new GoogleAuthProvider();



export { app, provider };
export const db = getFirestore(app)