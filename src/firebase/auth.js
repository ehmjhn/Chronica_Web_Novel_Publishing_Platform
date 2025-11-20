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
export const registerUser = async (email, password, displayName, fullname) => {
  const actionCodeSettings = {
    url: window.location.origin + '/login',
    handleCodeInApp: true
  };

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName });
    await sendEmailVerification(user, actionCodeSettings);
    auth.signOut()
    const user_3 = user;
    const userData = {
      name: fullname || "",
      displayName: user_3.displayName || "",
      bio: "",
      email: user_3.email || "",
      bdate: "",
      gender: "",
      location: "",
      contactNo: "",
      joinedDate: new Date().toISOString().split("T")[0],
      profilePic: user_3.photoURL || "",
      followersCount: 0,
      followingCount: 0,
      totalSeries: 0,
      bookmarkedStories: {},
      viewedStory: {}
    };

    const user_4 = user_3;
    console.log("Registration successful! Please verify your email before logging in.");
    alert("Registration successful! Please verify your email before logging in.");

    // Polling: check every 5 seconds if email is verified
    const interval = setInterval(() => {
      user_4.reload().then(async () => {
        if (user_4.emailVerified) {
          clearInterval(interval);
          alert("Verified")
          await set(ref(database, `users/${user_3.uid}`), userData);
          window.location.reload();
        }
      });
    }, 5000);
  } catch (error) {
    console.error("Error creating user:", error);
    alert(error.message);
  }
};

// login ngani
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    alert(error.message);
    return null;
  }
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
export const forgotPass = async (email) => {
  const actionCodeSettings = {
    url: window.location.origin + '/login',
    handleCodeInApp: true
  };

  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    alert("Password reset email sent!");
  } catch {
    alert("If this email exists, a password reset link has been sent.");
  }
}

// logout
export const logout = () => {
  signOut(auth).catch((e) => console.error(e.message));
};

// auth state listener
export const subscribeAuthChanges = (callback) =>
  onAuthStateChanged(auth, callback);
