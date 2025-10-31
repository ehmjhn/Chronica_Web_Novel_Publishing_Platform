import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential
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
    .then((result) => {
      const user = result.user;

      fetchSignInMethodsForEmail(auth, user.email)
        .then((methods) => {

          if (!methods.includes("password")) { //chineck kung first time nya lang iconnect yung account, kapag hindi, lilink sya

            const password = prompt("Set a password for manual login:"); //dapat modal??? pero alert muna 
            const credential = EmailAuthProvider.credential(user.email, password); 
            linkWithCredential(user, credential) //link para pwede na si user mag sign in via google ulit or manual using same account
              .then(() => alert("Google linked with manual login!")); 

          }

        });

      window.location.href = "/home";
    })
    .catch((error) => {
      console.log(error.message);
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