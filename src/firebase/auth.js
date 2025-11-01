import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile 
} from "firebase/auth";
import { app } from "./firebase-config";

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Register ngani
export const registerUser = (email, password, displayName) =>
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    updateProfile(user, {
      displayName: displayName,
    })
      .then(() => {
        console.log("User created and displayName added:", user.displayName);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  })
  .catch((error) => {
    // An error occurred during user creation
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error creating user:", errorCode, errorMessage);
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