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
import { getUserID, addUser } from "./db";
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

    const usertoDB = {
      userID : user.uid,
      name : displayName,
      viewedStory : {},
      bookmarkedStory:{}
    }

    //add to database
    addUser(usertoDB)
      .then( () => {
        console.log("User created and displayName added:", user.displayName);
        window.location.reload();

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
export const signInWithGoogle = async () => {
  try {
    // Wait for the popup to resolve
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user already exists in Firestore
    const existingUser = await getUserID(user.uid);

    if (!existingUser) {
      console.log("New Google user detected, adding to Firestore...");
      const usertoDB = {
        userID: user.uid,
        name: user.displayName,
        viewedStory: {},
        bookmarkedStory: {},
      };

      await addUser(usertoDB, user.uid);
      console.log("User added:", user.displayName);
    } else {
      console.log("User already exists in Firestore.");
    }

    // Redirect to home
    window.location.href = "/home";
  } catch (error) {
    alert(error.message);
    console.error("Google Sign-in Error:", error);
  }
};

//logout
export const logout = () =>
  signOut(auth)
    .catch((error) => {
      console.log(error.message);
    });


//reusable na onAuthStateChanged
export const subscribeAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback)
}


