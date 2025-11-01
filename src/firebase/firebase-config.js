// firebase-config.js
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAjtS5wT_NDvE2N2eogY6GLAHMET-LgxN0",
  authDomain: "web-novel-application.firebaseapp.com",
  databaseURL: "https://web-novel-application-default-rtdb.firebaseio.com",
  projectId: "web-novel-application",
  storageBucket: "web-novel-application.firebasestorage.app",
  messagingSenderId: "317531130381",
  appId: "1:317531130381:web:a06db4be50371911486344"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
const provider = new GoogleAuthProvider();

export { app, provider };
export const db = getFirestore(app)

// ========== ETO YUNG BAGONG DATABASE ==========

// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyDhy6YNlibhNuNrErIHLp7VIGnquBX2MtM",
//   authDomain: "users-novel-application.firebaseapp.com",
//   projectId: "users-novel-application",
//   storageBucket: "users-novel-application.firebasestorage.app",
//   messagingSenderId: "214521913323",
//   appId: "1:214521913323:web:37e006a4525df9357a83ae"
// };

// const app = initializeApp(firebaseConfig);