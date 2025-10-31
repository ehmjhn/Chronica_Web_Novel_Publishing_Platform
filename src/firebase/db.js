import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth.js";
import { ref, push, set, onValue, update } from "firebase/database";
import { db, database } from "../firebase/firebase-config.js";
import StorySection from "../components/StorySection.jsx";
import { getDocs, collection } from "firebase/firestore";

//get comicList

const comicCollectionRef = collection(db, "comic");
export const getComicList = async () => {
  try {
    const data = await getDocs(comicCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setComicList(filteredData);
    console.log(filteredData);
  } catch (e) {
    console.error(e);
  }
};

//insert Comic (Story)
export function insertComic(
  title,
  author,
  userID,
  likes,
  rate,
  genre,
  isCompleted
) {
  const comicRef = ref(database, "comic/");
  const newRef = push(comicRef);
  try {
    set(newRef, {
      title: title ,
      author: author ,
      userID: userID ,
      likes: likes,
      rate: rate,
      genre: genre,
      isCompleted: isCompleted,
    });
  } catch (e) {
    console.error(e);
  }
}

//read Comic
export function readComic(setComicList) {
  onValue(ref(database, "comic/"), (snapshot) => {
    const data = snapshot.val() || {}; //kunin object json
    const comics = Object.keys(data).map((key) => { //object to array para ma-map
      const comic = data[key]; 
      return {
        id: key,
        title: comic.title?.title || comic.title || "Untitled",
        author: comic.author?.author || comic.author || "Unknown",
        coverImage: comic.coverImage?.coverImage || comic.coverImage || "",
        views: comic.views?.views || comic.views || 0,
        rate: comic.rate?.rate || comic.rate || 0,
        isFeatured: comic.isFeatured || false,
        createdAt: comic.createdAt || ""
      };
    });
    setComicList(comics);
  });
}




