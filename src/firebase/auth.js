import { createUserWithEmailAndPassword, getAuth, 
        signInWithEmailAndPassword, singInWithPopup, googleProvider} from 'firebase/auth';
import app from './firebase-config';

export const auth = getAuth(app);

// Register ngani
export const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)
    .then(()=>{
        window.location.href = "/login"
    })
    .catch((error)=>{
        alert(error.message)
    })

// Sign in ngani
export const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
    .then(()=>{
        window.location.href = "/home"
    })
    .catch((error)=>{
        alert(error.message)
    })

    export const signInWithGoogle = () =>
       singInWithPopup(auth, googleProvider)
        .then(() => {
          window.location.href = "/home";
        })
        .catch((error) => {
          alert(error.message);
        });
