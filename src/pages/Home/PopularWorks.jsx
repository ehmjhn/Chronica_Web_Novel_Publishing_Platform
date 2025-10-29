import './home.css'

function PopularWorks() {

    /*
      FIREBASE INTEGRATION (to be added later):
      - Import Firestore functions:
          import { collection, getDocs } from "firebase/firestore";
          import { db } from "../../firebase";

      - Inside useEffect or function:
          const querySnapshot = await getDocs(collection(db, "popularWorks"));
          const data = querySnapshot.docs.map(doc => doc.data());
          setPopularWorks(data);
    */

    return (
        <div className="popular-page">
            <h1>Popular Works</h1>

            {/* Display list of popular works here later
                Example:
                {popularWorks.map((story, index) => (
                  <div key={index}>
                    <h2>{story.title}</h2>
                    <p>By {story.author}</p>
                  </div>
                ))}
            */}
        </div>
    );
}

export default PopularWorks;
