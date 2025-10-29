import './home.css'

function FeaturedStories() {

    /*
      FIREBASE INTEGRATION (to be added later):
      - Import Firestore functions:
          import { collection, getDocs } from "firebase/firestore";
          import { db } from "../../firebase"; // your firebase config

      - Inside useEffect or function:
          const querySnapshot = await getDocs(collection(db, "featuredStories"));
          const data = querySnapshot.docs.map(doc => doc.data());
          setFeaturedStories(data);
    */

    return (
        <div className="featured-page">
            <h1>Featured Stories</h1>

            {/* 🔸 Display list of featured stories here later
                Example:
                {featuredStories.map((story, index) => (
                  <div key={index}>
                    <h2>{story.title}</h2>
                    <p>By {story.author}</p>
                  </div>
                ))}
            */}
        </div>
    );
}

export default FeaturedStories;
