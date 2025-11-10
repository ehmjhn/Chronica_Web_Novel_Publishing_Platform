import './not-found.css'
import ERRORICON from "../../assets/error404icon.png";
import LOGO from '../../assets/CHRONICA.png'
import { NavLink } from 'react-router';
// ako rito bawal iba ok -jz OK. try ko toh  ayaw lumabas omai
// ayaw -danielle
function NotFound() {
  return (
    <>
      <div className="header">
          <NavLink to="/home">
            <img src={LOGO} alt="Chronica logo" />
          </NavLink>
      </div>
      <div className="errorcontainer">
        <h2>ERROR 404 PAGE</h2>
        <img className="erroricon" src={ERRORICON} alt="Error Icon" />
        <p>uh-oh Nothing here...</p>
          <NavLink to='/home' className="back-button">GO BACK TO HOME</NavLink>
      </div>
      <div className="footer">
        <div className="footer-top">
          <p className="footer-brand">Chronica</p>
          <p className="footer-copy">
            © 2025 Paranoic Software Solutions. All Rights Reserved.
          </p>
        </div>

        <div className="footer-links">
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/terms" className="footer-link">Terms of Service</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
      </div>
    </>
  );
}

export default NotFound;