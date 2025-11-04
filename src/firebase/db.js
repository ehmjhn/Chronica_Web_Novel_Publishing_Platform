import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth.js";
import { ref, push, set, onValue, update, get } from "firebase/database";
import { db, database } from "../firebase/firebase-config.js";
import StorySection from "../components/StorySection.jsx";
import { getDocs, collection, setDoc, doc, snapshotEqual } from "firebase/firestore";

//pang users natong firestore database
//USER(FIRESTORE)

//getUserAccs
const userCollectionRef = collection(db, "users");
export const getUserList = async (users) => {
   try {
      const data = await getDocs(userCollectionRef);
      const filteredData = data.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id,
      }));
      getUserList(users)

   } catch (e) {
      console.error(e);
   }
};

//search for userID in collection
export async function getUserID(uid) {
   const usersRef = ref(database, "users");
   try {
      const snapshot = await get(usersRef);
      const data = snapshot.val();

      if (!data) return false;

      const exists = Object.values(data).some((item) => item.userID === uid);
      return exists;
   } catch (error) {
      console.error("Error checking user:", error);
      return false;
   }
}

export const addUser = async (user) => {
   console.log("adduser called with: ", user);
   await push(ref(database, "users"), user).then(() => {
      console.log("New user has been added.")
   }).catch((error) => {
      console.error(error);
   });
};

//REALTIME DATABASE
export function insertComic(
   title,
   author,
   userID,
   likes,
   rate,
   genre,
   profilePic,
   isCompleted
) {
   const comicRef = ref(database, "comics"); // <- changed to "comics"
   const newRef = push(comicRef);
   try {
      set(newRef, {
         title: title,
         author: {
            name: author,
            profilePic: profilePic,
            uid: userID,
         },
         userID: userID,
         likes: likes,
         rate: rate,
         genre: genre,
         isCompleted: isCompleted,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
      });
   } catch (e) {
      console.error(e);
   }
}

// Read comics
export function readComic(setComicList) {
   const comicRef = ref(database, "comics"); // <- changed to "comics"
   onValue(comicRef, (snapshot) => {
      const data = snapshot.val() || {};
      const comics = Object.keys(data).map((key) => {
         const comic = data[key];
         return {
            id: key,
            title: comic.title || "Untitled",
            author: comic.author?.name || "Unknown",
            profilePic: comic.author?.profilePic || "",
            userID: comic.userID || "",
            coverImage: comic.coverImage || "",
            views: comic.views || 0,
            bookmarks: comic.bookmarks || 0,
            rate: comic.rate || 0,
            isFeatured: comic.isFeatured || false,
            isCompleted: comic.isCompleted || false,
            genre: comic.genre || [],
            totalChapters: comic.totalChapters || 0,
            createdAt: comic.createdAt || "",
            updatedAt: comic.updatedAt || "",
            latestChapter: comic.latestChapter || null,
         };
      });
      console.log(comics);
      setComicList(comics);
   });
}