import './not-found.css'
import ERRORICON from "../../assets/error404icon.png";
// ako rito bawal iba ok -jz OK. try ko toh  ayaw lumabas omai
// ayaw -danielle
function NotFound() {
  return (
    <div className="errorcontainer">
      <h2>ERROR 404 PAGE</h2>
      <img className="erroricon" src={ERRORICON} alt="Error Icon" />
      <p>uh-oh Nothing here...</p>
        <button className="back-button">GO BACK TO HOME</button>
      
    </div>
  );
}

export default NotFound;
