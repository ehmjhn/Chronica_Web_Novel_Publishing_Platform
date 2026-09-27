import "./components.css";
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import LOGO from "../assets/CHRONICA.webp";
import { logout } from "../firebase/auth";
import { useAuthUser } from "../hooks/useAuthUser";
import { useToast } from "./toast-context";
import { displayNameOf } from "../lib/format";

const NAV_LINKS = [
  { to: "/home/featured-stories", label: "Featured Stories" },
  { to: "/home/latest-releases", label: "Latest Releases" },
  { to: "/home/popular-works", label: "Popular Works" },
  { to: "/about-us", label: "About" },
  { to: "/help", label: "Help" },
];

const ACCOUNT_LINKS = [
  { to: "/profile", label: "Account Settings", icon: "fa-user-gear" },
  { to: "/notification", label: "Notifications", icon: "fa-bell" },
  { to: "/bookmark", label: "Reading List", icon: "fa-bookmark" },
  { to: "/my-series", label: "My Series", icon: "fa-layer-group" },
];

function Avatar({ src, name, size = 34 }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span
        className="nav-avatar-fallback"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-hidden="true"
      >
        {String(name || "?").charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="nav-avatar"
      onError={() => setFailed(true)}
    />
  );
}

export default function Nav() {
  const { user, profile, loading } = useAuthUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Close the account dropdown on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const name = displayNameOf(profile || user);
  const avatar = profile?.profilePic || user?.photoURL;

  async function handleLogout() {
    setMenuOpen(false);
    try {
      await logout();
      toast.success("You have been signed out.");
      navigate("/home", { replace: true });
    } catch {
      toast.error("Could not sign you out. Please try again.");
    }
  }

  return (
    <>
      <nav>
        <div className="title">
          <NavLink to="/home" aria-label="Chronica home">
            <img src={LOGO} alt="Chronica" />
          </NavLink>
        </div>

        <div className="account-wrapper" ref={wrapperRef}>
          {loading ? (
            <div className="account">
              <span className="nav-avatar-skeleton" aria-hidden="true" />
            </div>
          ) : user ? (
            <>
              <button
                type="button"
                className="account"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <Avatar src={avatar} name={name} />
                <h4>{name}</h4>
                <i className={`fa-solid fa-caret-down ${menuOpen ? "is-open" : ""}`} aria-hidden="true" />
              </button>

              {menuOpen && (
                <div className="nav-settings" role="menu">
                  <h2>{name}</h2>
                  {ACCOUNT_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      <i className={`fa-solid ${link.icon}`} aria-hidden="true" /> {link.label}
                    </NavLink>
                  ))}
                  {profile && (
                    <NavLink
                      to={`/author/${user.uid}`}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      <i className="fa-solid fa-id-badge" aria-hidden="true" /> Public profile
                    </NavLink>
                  )}
                  <button type="button" className="nav-logout" onClick={handleLogout} role="menuitem">
                    <i className="fa-solid fa-right-from-bracket" aria-hidden="true" /> Log Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="account">
                <i className="fa-solid fa-circle-user" style={{ fontSize: "30px" }} aria-hidden="true" />
                <h4>Guest</h4>
              </div>
              <div className="nav-settings">
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="nav2">
        <div className="nav2-left">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className="dropbtn">
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav2-right">
          <NavLink to="/search-discovery" className="nav2-btn">
            <i className="fa-solid fa-book-open-reader" aria-hidden="true" /> Read Story
          </NavLink>
          <NavLink to={user ? "/create-story" : "/login"} className="nav2-btn">
            <i className="fa-solid fa-feather-pointed" aria-hidden="true" /> Write Story
          </NavLink>
        </div>
      </div>
    </>
  );
}
