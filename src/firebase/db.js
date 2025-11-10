// db.js
import { getDatabase, get, ref, set, push, onValue, update } from "firebase/database";
import { app } from "./firebase-config.js";

export const database = getDatabase(app);

//retrieve your profile
export const getUserProfile = (userId) => {
  return get(ref(database, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); 
      } else {
        console.log("No user data available");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      return null;
    });
};

//retrieve users
export const retrieveUsers = (callback) => {
  const userRef = ref(database, `users/`);

  const unsubscribe = onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data)
    const user = Object.entries(data).map(([id, value]) => ({
      id,
      ...value
    }));
    callback(user); 
  });

  return unsubscribe; 
};

// retrieve stories
export const readComic = (callback) => {
  const comicRef = ref(database, "stories/");

  const unsubscribe = onValue(comicRef, (snapshot) => {
    const data = snapshot.val() || {};
    const comics = Object.entries(data).map(([id, value]) => ({
      id,
      ...value
    }));
    callback(comics); 
  });

  return unsubscribe; 
};

// retrieve chapters
export const retrieveChapter = (callback) => {
  const chapRef = ref(database, `chapters/`)

  const unsubscribe = onValue(chapRef, (snapshot) => {
    const data = snapshot.val()
    const chapters = Object.entries(data).map(([id, value])=>({
      id,
      ...value
    }));
    callback(chapters); 
  });

  return unsubscribe;
};

//retrieve review
export const retrieveReviews = (callback) => {
  const revRef = ref(database, `reviews/`)

  const unsubscribe = onValue(revRef, (snapshot)=>{
    const data = snapshot.val()
    const reviews = Object.entries(data).map(([id, value])=>({
      id,
      ...value
    }));
    callback(reviews)
  });

  return unsubscribe
}

// add review
export const addReview = (reviewData, callback) => {
  if (!reviewData || !reviewData.id) {
    console.error("Review data must have an 'id' property");
    return;
  }

  const reviewRef = ref(database, `reviews/${reviewData.id}`);

  try {
    set(reviewRef, {
      storyId: reviewData.storyId,
      userId: reviewData.userId,
      user: reviewData.user || "",
      topic: reviewData.topic || "",
      text: reviewData.text || "",
      score: reviewData.score || 0,
      date: reviewData.date || new Date().toISOString(),
      likes: reviewData.likes || 0
    });

    if (callback) callback(reviewData.id); // return the review id
  } catch (error) {
    console.error("Error adding review:", error);
  }
};

// update user profile
export const updateUserProfile = (uid, newData) => {
  const userRef = ref(database, `users/${uid}`);
  try {
    return update(userRef, newData);
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

// Add comic
export const insertComic = (
  title,
  author,
  userID,
  likes,
  rate,
  genre,
  profilePic,
  isCompleted
) => {
  const comicRef = ref(database, "stories/");
  const newRef = push(comicRef);
  try {
    set(newRef, {
      title,
      author: {
        name: author,
        profilePic,
        uid: userID,
      },
      userID,
      likes,
      rate,
      genre,
      isCompleted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error inserting comic:", error);
  }
};

