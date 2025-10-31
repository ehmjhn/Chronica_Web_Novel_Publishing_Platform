import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "./firebase-config";

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Register ngani
export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "/login";
    })
    .catch((error) => {
      alert(error.message);
    });
// Sign in ngani
export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "/home";
    })
    .catch((error) => {
      alert(error.message);
    });

//google gamit
export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "/home";
    })
    .catch((error) => {
      alert(error.message);
    });
};

//logout
export const logout = () =>
  signOut(auth)
    .catch((error) => {
      console.log(error.message);
    });

//reusable na onAuthStateChanged
export const subscribeAuthChanges = (callback) =>{
  return onAuthStateChanged(auth, callback)
} 