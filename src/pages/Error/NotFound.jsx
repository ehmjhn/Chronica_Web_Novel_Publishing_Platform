import "./not-found.css";
import { Link } from "react-router";
import ERRORICON from "../../assets/error404icon.webp";

/**
 * Rendered by the `*` route inside MainLayout, so the nav and footer come from
 * the layout. This page used to render its own header and footer, which
 * duplicated the chrome, and linked to /privacy, /terms and /contact — routes
 * that do not exist, so every one of those links landed back here.
 */
export default function NotFound() {
  return (
    <div className="errorcontainer">
      <h2>ERROR 404 PAGE</h2>
      <img className="erroricon" src={ERRORICON} alt="" />
      <p>We couldn't find that page.</p>
      <Link to="/home" className="back-button">
        Go back to home
      </Link>
    </div>
  );
}
