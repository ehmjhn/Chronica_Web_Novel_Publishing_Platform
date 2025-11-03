import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth.js";
import { ref, push, set, onValue, update } from "firebase/database";
import { db, database } from "../firebase/firebase-config.js";
import StorySection from "../components/StorySection.jsx";
import { getDocs, collection } from "firebase/firestore";

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
      console.log(filteredData);
   } catch (e) {
      console.error(e);
   }
};

//search for userID in collection
export const getUserID = async (user) => {
   try {
      const data = await getDocs(userCollectionRef);
      const filteredData = data.docs.map((doc) => ({
         ...doc.data(),
         id: doc.id,
      }));
      const userExists = filteredData.some((users) => { users.id === user })
      if (!userExists) {
         console.log("User not Found");
         return false;
      }
      else {
         console.log("User found.");
         return true;
      }

   } catch (e) {
      console.error(e);
   }
}

export const addUser = async (user) => {
   try {
      const docRef = await addDoc(userCollectionRef, user);
      console.log("Document written with ID: ", docRef.id);
   } catch (e) {
      console.error("Error adding document: ", e);
   }
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
   const comicRef = ref(database, "comics/"); // <- changed to "comics"
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
   const comicRef = ref(database, "comics/"); // <- changed to "comics"
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