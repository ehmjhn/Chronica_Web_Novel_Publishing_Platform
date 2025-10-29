import './home.css'

function LatestStories() {

    /*
      FIREBASE INTEGRATION (to be added later):
      - Import Firestore functions:
          import { collection, getDocs } from "firebase/firestore";
          import { db } from "../../firebase";

      - Inside useEffect or function:
          const querySnapshot = await getDocs(collection(db, "latestStories"));
          const data = querySnapshot.docs.map(doc => doc.data());
          setLatestStories(data);
    */

    return (
        <div className="latest-page">
            <h1>Latest Stories</h1>

            {/* Display list of latest stories here later
                Example:
                {latestStories.map((story, index) => (
                  <div key={index}>
                    <h2>{story.title}</h2>
                    <p>By {story.author}</p>
                  </div>
                ))}
            */}
        </div>
    );
}

export default LatestStories;
