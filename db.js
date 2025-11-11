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
export const addReview = (reviewData) => {
  const reviewRef = push(ref(database, 'reviews/'));

  set(reviewRef, {
    storyId: reviewData.storyId,
    userId: reviewData.userId,
    topic: reviewData.topic || "",
    message: reviewData.message || "",
    rating: reviewData.rating || 0,
    createdAt: reviewData.createdAt,
    likes: 0
  })
  .then(() => {
    console.log("Review added successfully!");
  })
  .catch((error) => {
    console.error("Error adding review:", error);
  });
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

//update review
export const updateReview = (reviewId, updatedData) => {
  const reviewRef = ref(database, `reviews/${reviewId}`);

  update(reviewRef, updatedData)
    .then(() => console.log("Review updated successfully!"))
    .catch((error) => console.error("Error updating review:", error));
};

//update bookmark
export const updateBookmark = (userId, storyId, callback) => {
  get(ref(database, `users/${userId}/bookmarkedStories`))
    .then(snapshot => {
      const bookmarks = snapshot.val() || [];
      const updated = bookmarks.includes(storyId)
        ? bookmarks.filter(id => id !== storyId) 
        : [...bookmarks, storyId];               

      set(ref(database, `users/${userId}/bookmarkedStories`), updated)
        .then(() => callback && callback(updated))
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

// Add comic
export const insertStory = async (
  title,
  authorId,
  genre,
  status,
  synopsis,
  contentWarning,
  tags
) => {
  const comicRef = ref(database, "stories/");
  const userRef = ref(database, `users/${authorId}/createdSeries`)
  const newRef = push(comicRef);
  const key = newRef.key
  const comicJSON = {
    title: title,
    authorId: authorId,
    likes: 0,
    rate: 0,
    contentWarning: contentWarning,
    isFeatured: false,
    tags: tags,
    synopsis: synopsis,
    genre: genre,
    status: status,
    totalChapters: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  const user = await get(userRef)
  const stories = user.val()|| [];
  const isCreated = stories.includes(key)
  const updated = isCreated ?
    stories.filter(id => id !== key) : [...stories, key]
  try {
    await set(newRef, comicJSON
    );
    await set(userRef, updated)
  } catch (error) {
    console.error("Error inserting comic:", error);
  }
};


export async function addFollowerList(userId, followedId) {
  try {
    const followingListRef = ref(database, `users/${userId}/followingList`);
    const followingCountRef = ref(database, `users/${userId}/followingCount`);
    const followersCountRef = ref(database, `users/${followedId}/followersCount`);

    const followingSnapshot = await get(followingListRef);
    let followingList = followingSnapshot.val() || [];

    if (followingList.includes(followedId)) {
      console.log("You already followed this user.");
      return;
    }

    followingList.push(followedId);
    await set(followingListRef, followingList);

    const followingCountSnapshot = await get(followingCountRef);
    let followingCount = followingCountSnapshot.val() || 0;
    followingCount += 1;
    await set(followingCountRef, followingCount);

    const followersCountSnapshot = await get(followersCountRef);
    let followersCount = followersCountSnapshot.val() || 0;
    followersCount += 1;
    await set(followersCountRef, followersCount);

    console.log("Followed successfully!");
  } catch (error) {
    console.error("Error following user:", error);
  }
}

export async function deleteFollowerList(userId, followedId) {
  try {

    const followingListRef = ref(database, `users/${userId}/followingList`);
    const followingCountRef = ref(database, `users/${userId}/followingCount`);
    const followersCountRef = ref(database, `users/${followedId}/followersCount`);

    const followingSnapshot = await get(followingListRef);
    let followingList = followingSnapshot.val() || [];

    if (!followingList.includes(followedId)) {
      console.log("Already unfollowed this user.");
      return;
    }

    followingList = followingList.filter(id => id !== followedId);
    await set(followingListRef, followingList);

    const followingCountSnapshot = await get(followingCountRef);
    let followingCount = followingCountSnapshot.val() || 0;
    followingCount = Math.max(followingCount - 1, 0); 
    await set(followingCountRef, followingCount);

    const followersCountSnapshot = await get(followersCountRef);
    let followersCount = followersCountSnapshot.val() || 0;
    followersCount = Math.max(followersCount - 1, 0); 
    await set(followersCountRef, followersCount);

    console.log("Unfollowed successfully!");
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
}

export async function checkIfFollowed(userId, followedId) {
  try {
    const followingRef = ref(database, `users/${userId}/followingList`);
    const snapshot = await get(followingRef);
    const followingList = snapshot.val() || [];
    return followingList.includes(followedId);
  } catch (error) {
    console.error(error);
    return false;
  }
}


