// db.js
import { getDatabase, get, ref, set, push, onValue, update, remove} from "firebase/database";
import { app } from "./firebase-config.js";

export const database = getDatabase(app);

//retrieve your profile
export const getUserProfile = (userId) => {
  return get(ref(database, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
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
    const chapters = Object.entries(data).map(([id, value]) => ({
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

  const unsubscribe = onValue(revRef, (snapshot) => {
    const data = snapshot.val()
    const reviews = Object.entries(data).map(([id, value]) => ({
      id,
      ...value
    }));
    callback(reviews)
  });

  return unsubscribe
}

// add review
export const addReview = (reviewData, callback) => {
  if (!reviewData) {
    console.log(reviewData)
    console.log(reviewData.storyId)
    console.error("Review data must have an 'id' property");
    return;
  }

  const reviewRef = ref(database, `reviews/${reviewData.userId}`);

  try {
    set(reviewRef, {
      storyId: reviewData.storyId,
      userId: reviewData.userId,
      user: reviewData.user || "",
      topic: reviewData.topic || "",
      text: reviewData.text || "",
      score: reviewData.score || 0,
      createdAt: reviewData.date || new Date().toISOString(),
      likes: reviewData.likes || 0
    });
    // return the review id
  } catch (error) {
    console.error("Error adding review:", error);
  };
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


export async function addbookmarkedStories(userId, storyId) {
  try {
    const userRef = ref(database, `users/${userId}/bookmarkedStories/${storyId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return false; 
    } else {
      await set(userRef, { storyId });
      console.log("Added to bookmark.")
      return true; 
    }
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

export async function checkBookmark(userId, storyId) {
  try {
    const userRef = ref(database, `users/${userId}/bookmarkedStories/${storyId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteBookmark(userId, storyId) {
  try {
    const userRef = ref(database, `users/${userId}/bookmarkedStories/${storyId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      await remove(userRef, storyId)
      console.log("removed from bookmark.")
      return false;
    } else {
      console.log("Already deleted to bookmark.")
      return true;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
