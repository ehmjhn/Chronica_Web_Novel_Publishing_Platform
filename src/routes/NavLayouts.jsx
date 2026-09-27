import "./routes.css";
import { useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LOGO from "../assets/CHRONICA.webp";

const AUTH_LINKS = [
  { to: "/about-us", label: "About" },
  { to: "/help", label: "Help" },
  { to: "/search-discovery", label: "Browse Stories" },
];

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Honour in-page anchors (e.g. /help#publishing) instead of yanking the
    // reader back to the top and hiding the section they asked for.
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

export function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export function AuthLayout() {
  return (
    <div className="background">
      <ScrollToTop />

      <div className="header">
        <Link to="/home">
          <img src={LOGO} alt="Chronica" />
        </Link>
      </div>

      <main>
        <Outlet />
      </main>

      <div className="footer">
        <div className="footer-top">
          <p className="footer-brand">Chronica</p>
          <p className="footer-copy">
            © {new Date().getFullYear()} Paranoic Software Solutions. All Rights Reserved.
          </p>
        </div>

        <div className="footer-links">
          {AUTH_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="footer-link">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
