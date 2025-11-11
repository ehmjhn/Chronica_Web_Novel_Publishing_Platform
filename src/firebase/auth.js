// auth.js
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  EmailAuthProvider,
  linkWithCredential
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { database } from "./db.js"; 
import { app } from "./firebase-config.js";

// init
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

//register ngani
export const registerUser = (email, password, displayName, fullname) => {
  const actionCodeSettings = {
    url: window.location.origin + '/login',
    handleCodeInApp: true
  };

  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      return updateProfile(user, { displayName })
        .then(() => sendEmailVerification(user, actionCodeSettings))
        .then(() => user);
    })
    .then((user) => {
      const userData = {
        name: fullname || "",
        displayName: user.displayName || "",
        bio: "",
        email: user.email || "",
        bdate: "",
        gender: "",
        location: "",
        contactNo: "",
        joinedDate: new Date().toISOString().split("T")[0],
        profilePic: user.photoURL || "",
        followersCount: 0,
        followingCount: 0,
        totalSeries: 0,
        bookmarkedStories: {},
        viewedStory: {}
      };

      return set(ref(database, `users/${user.uid}`), userData).then(() => user);
    })
    .then((user) => {
      console.log("Registration successful! Please verify your email before logging in.");
      alert("Registration successful! Please verify your email before logging in.");

      // Polling: check every 5 seconds if email is verified
      const interval = setInterval(() => {
        user.reload().then(() => {
          if (user.emailVerified) {
            clearInterval(interval);
            alert("Email verified! Reloading page...");
            window.location.reload();
          }
        });
      }, 5000);
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      alert(error.message);
    });
};

// login ngani
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      return user;
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

//google sign in ngani
export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const userRef = ref(database, `users/${user.uid}`);

      get(userRef).then((snapshot) => {
        if (!snapshot.exists()) {
          const userData = {
            name: user.displayName || "",
            displayName: user.displayName || "",
            bio: "",
            email: user.email || "",
            bdate: "",
            gender: "",
            location: "",
            contactNo: "",
            joinedDate: new Date().toISOString().split("T")[0],
            profilePic: user.photoURL || "",
            followersCount: 0,
            followingCount: 0,
            totalSeries: 0,
            bookmarkedStories: {},
            viewedStory: {}
          };

          set(userRef, userData).catch((err) => console.error(err));
        }
       
      }).catch((err) => console.error(err));
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
      alert(error.message);
    });
};

//set pass for google acc
export const setPasswordForGoogleUser = (user, newPassword) => {
  if (!user) return;

  const credential = EmailAuthProvider.credential(user.email, newPassword);

  linkWithCredential(user, credential)
    .then(() => {
      console.log("Password set successfully!");
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
};

//nakalimutan ngani
export const forgotPass = (email) =>{
  const actionCodeSettings = {
    url: window.location.origin + '/login',
    handleCodeInApp: true
  };
  
  return sendPasswordResetEmail(auth, email, actionCodeSettings)
  .then(()=>{
    alert("Password reset email sent!")
  })
  .catch(() => {
    alert("If this email exists, a password reset link has been sent.");
  });
}

// logout
export const logout = () => {
  signOut(auth).catch((e) => console.error(e.message));
};

// auth state listener
export const subscribeAuthChanges = (callback) =>
  onAuthStateChanged(auth, callback);
