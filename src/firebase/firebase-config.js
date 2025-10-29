import { initializeApp } from "firebase/app";
import {GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAjtS5wT_NDvE2N2eogY6GLAHMET-LgxN0",
  authDomain: "web-novel-application.firebaseapp.com",
  projectId: "web-novel-application",
  storageBucket: "web-novel-application.firebasestorage.app",
  messagingSenderId: "317531130381",
  appId: "1:317531130381:web:a06db4be50371911486344"
};

const app = initializeApp(firebaseConfig);
//pede ba ishare ung sa console.firebase? para makita ko
export const googleProvider = new GoogleAuthProvider();
export default app;