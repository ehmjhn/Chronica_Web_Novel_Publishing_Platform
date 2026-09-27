// auth.js — Firebase Authentication plus first-party profile provisioning.
//
// This module never calls alert() and never reloads the page; it returns or
// throws so the calling form can show an inline message and a toast.

import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { get, set, update, ref } from "firebase/database";
import { app } from "./firebase-config.js";
import { database } from "./db.js";
import { buildUserProfile, DEFAULT_USER } from "./db.js";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const isGoogleUser = (user) => user?.providerData?.some((p) => p.providerId === "google.com");
const hasPasswordProvider = (user) => user?.providerData?.some((p) => p.providerId === "password");

export { isGoogleUser, hasPasswordProvider };

/** Turns a Firebase error code into something a person can act on. */
export function friendlyAuthError(error) {
  const map = {
    "auth/invalid-email": "That email address looks invalid.",
    "auth/user-not-found": "No account exists for that email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-login-credentials": "Incorrect email or password.",
    "auth/email-already-in-use": "An account already exists for that email.",
    "auth/weak-password": "Please choose a stronger password.",
    "auth/too-many-requests": "Too many attempts. Please try again in a moment.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/popup-closed-by-user": "The sign-in window was closed before finishing.",
    "auth/popup-blocked": "Your browser blocked the sign-in popup.",
    "auth/account-exists-with-different-credential":
      "An account already exists with that email using a different sign-in method.",
    "auth/requires-recent-login": "Please sign in again before making this change.",
    "auth/operation-not-allowed": "This sign-in method is disabled. Contact support.",
  };
  return map[error?.code] || error?.message || "Something went wrong. Please try again.";
}

/**
 * Creates the auth account, provisions the database profile immediately, and
 * sends the verification email. The profile is written up-front so the user
 * never lands on a blank account if they close the tab before verifying.
 */
export const registerUser = async ({ email, password, displayName, fullName }) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/login`,
    handleCodeInApp: true,
  };

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName });
  await set(
    ref(database, `users/${user.uid}`),
    buildUserProfile({
      uid: user.uid,
      displayName,
      email: user.email,
      photoURL: user.photoURL,
      fullName,
    })
  );
  await sendEmailVerification(user, actionCodeSettings);
  await signOut(auth);

  return user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/** Signs in with Google, provisioning the database profile on first login. */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  await ensureUserProfile(user);
  return user;
};

/** Creates the DB profile if it is missing (e.g. first Google login). */
export const ensureUserProfile = async (user) => {
  const userRef = ref(database, `users/${user.uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    await set(
      userRef,
      buildUserProfile({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        fullName: user.displayName,
      })
    );
  } else {
    // Older accounts were created with placeholder fields; backfill what's missing.
    const existing = snapshot.val();
    const backfill = {};
    if (!Array.isArray(existing.bookmarkedStories)) backfill.bookmarkedStories = DEFAULT_USER.bookmarkedStories;
    if (!Array.isArray(existing.likedStories)) backfill.likedStories = DEFAULT_USER.likedStories;
    if (existing.followersCount == null) backfill.followersCount = 0;
    if (existing.followingCount == null) backfill.followingCount = 0;
    if (existing.totalSeries == null) backfill.totalSeries = 0;
    if (Object.keys(backfill).length) await update(userRef, backfill);
  }
  return user;
};

/** Links a password onto a Google account so email/password sign-in works. */
export const setPasswordForGoogleUser = async (user, newPassword) => {
  if (!user) throw new Error("No user found. Please sign in again.");
  if (!user.email) throw new Error("This account has no email address.");

  const alreadyHasPassword = hasPasswordProvider(user);
  if (alreadyHasPassword) {
    await updateProfile(user, {});
    throw new Error("This account already has a password. Use 'Forgot Password?' instead.");
  }

  const credential = EmailAuthProvider.credential(user.email, newPassword);
  await linkWithCredential(user, credential);
  return true;
};

export const forgotPass = async (email) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/login`,
    handleCodeInApp: true,
  };
  await sendPasswordResetEmail(auth, email, actionCodeSettings);
  return true;
};

export const resendVerification = async (user) => {
  if (!user) throw new Error("Please sign in first.");
  if (user.emailVerified) return false;
  await sendEmailVerification(user);
  return true;
};

export const logout = () => signOut(auth);

/** Re-reads the auth user, e.g. after an email-verification link is opened. */
export const refreshUser = async () => {
  await reload(auth.currentUser);
  return auth.currentUser;
};

export const subscribeAuthChanges = (callback) => onAuthStateChanged(auth, callback);
