import "./components.css";
import LOGO from '../assets/CHRONICA.png'
import { NavLink } from "react-router";
import { logout, subscribeAuthChanges } from '../firebase/auth';
import { getUserProfile } from "../firebase/db";
import { useEffect, useState } from "react";

function Nav() {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {

    const unsubscribe = subscribeAuthChanges((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        getUserProfile(currentUser.uid)
          .then(userData => {
            if (userData) {
              setUserData(userData);
            }
          });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();

  }, []);

  function handleLogout() {
    logout();
    window.location.href = '/login'
  }

  return (
    <>
      <nav>
        <div className="title">
          <NavLink to="/home">
            <img src={LOGO} alt="Chronica logo" />
          </NavLink>
        </div>

        {/* <div className="search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            aria-label="Search"
          />
          <NavLink to="/notification">
            <i className="fa-solid fa-bell"></i>
          </NavLink>
        </div> */}

        <div className="account-wrapper">
          {!user || (!user.emailVerified && !user.providerData?.some(p => p.providerId === "google.com")) ? (
            <>
              <div className="account">
                <i
                  style={{ fontSize: "30px" }}
                  className="fa-solid fa-circle-user"
                ></i>
                <h2>Guest</h2>
                <i className="fa-solid fa-caret-down"></i>
              </div>
              
              <div className="nav-settings">
                <h2>Guest</h2>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </div>
            </>
          ) : (
            <>
              <div className="account">
                {user.photoURL == null ? (
                  <i
                    style={{ fontSize: "30px" }}
                    className="fa-solid fa-circle-user"
                  ></i>
                ) : (
                  <img src={userData?.profilePic} alt="User profile" />

                )}
                {userData?.displayName == null ? (
                  <h4>{userData?.name}</h4>) : (<h4>{userData.displayName}</h4>
                )}
                <i className="fa-solid fa-caret-down"></i>
              </div>

              <div className="nav-settings">
                <h2>{user.displayName}</h2>
                <NavLink to="/profile">Account Settings</NavLink>
                <NavLink to="/author-profile">Profile Page</NavLink>
                <NavLink to="/bookmark">Reading List</NavLink>
                <NavLink to="/my-series">My Series</NavLink>
                {/* Add type="button" to avoid accidental form submission */}
                <NavLink to="" onClick={handleLogout}>
                  Log Out
                </NavLink>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="nav2">
        <div className="nav2-left">
          <NavLink to="/home/featured-stories" className="dropbtn">
            Featured Stories
          </NavLink>
          <NavLink to="/home/latest-releases" className="dropbtn">
            Latest Releases
          </NavLink>
          <NavLink to="/home/popular-works" className="dropbtn">
            Popular Works
          </NavLink>

          {/* <div className="dropdown">
            <button className="dropbtn">
              Categories <i className="fa-solid fa-angle-down"></i>
            </button>
            <div className="dropdown-content">
              <div className="genre-grid">
                {/* FIX: NavLink should use "to" instead of "href" */}
          {/* <NavLink to="#">Action</NavLink>
                <NavLink to="#">Romance</NavLink>
                <NavLink to="#">Fantasy</NavLink>
                <NavLink to="#">Drama</NavLink>
                <NavLink to="#">Comedy</NavLink>
                <NavLink to="#">Adventure</NavLink>
                <NavLink to="#">Mystery</NavLink>
                <NavLink to="#">Sci-Fi</NavLink>
                <NavLink to="#">Slice of Life</NavLink>
                <NavLink to="#">Horror</NavLink>
                <NavLink to="#">Thriller</NavLink>
                <NavLink to="#">Historical</NavLink>
                <NavLink to="#">Supernatural</NavLink>
                <NavLink to="#">Sports</NavLink>
                <NavLink to="#">Psychological</NavLink>
              </div>
            </div>
          </div> */}

          <NavLink to="/about-us" className="dropbtn">
            About
          </NavLink>
        </div>

        <div className="nav2-right">
          <NavLink to="/search-discovery" className="nav2-btn">
            <i className="fa-brands fa-readme"></i> Read Story
          </NavLink>
          <NavLink to="/create-story" className="nav2-btn">
            <i className="fa-solid fa-feather"></i> Write Story
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Nav