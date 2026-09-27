import "./components.css";
import { Link } from "react-router";

const QUICK_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/search-discovery", label: "Browse Stories" },
  { to: "/home/latest-releases", label: "Latest Releases" },
  { to: "/about-us", label: "About Us" },
  { to: "/help", label: "Help" },
];

const HIGHLIGHTS = [
  "Manage and organize your stories",
  "Track chapter updates and analytics",
  "Engage with your audience",
  "Distribute content across multiple platforms",
];

export default function Footer() {
  return (
    <>
      <div className="above-footer">
        <div className="above-info">
          <div className="footer-column about-box">
            <h3>About Chronica</h3>
            <p>
              Chronica is a Creative Content Management and Distribution System for authors, creators, and
              publishers. Streamline your storytelling, track readership, and distribute content seamlessly.
            </p>
            <ul>
              {HIGHLIGHTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="footer-column links-box">
            <h3>Quick Links</h3>
            <ul>
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column contact-box">
            <h3>Contact &amp; Ads</h3>
            <p>
              Email: <a href="mailto:support@chronica.com">support@chronica.com</a>
            </p>
            <p>
              Advertising: <a href="mailto:ads@chronica.com">ads@chronica.com</a>
            </p>
          </div>
        </div>
      </div>

      <footer>
        <p className="footer-brand">Chronica</p>
        <p>© {new Date().getFullYear()} Paranoic Software Solutions. All Rights Reserved.</p>
        <div className="footer-links">
          <Link to="/about-us" className="footer-link">
            About
          </Link>
          <Link to="/help" className="footer-link">
            Help
          </Link>
          <Link to="/search-discovery" className="footer-link">
            Browse
          </Link>
        </div>
      </footer>
    </>
  );
}
