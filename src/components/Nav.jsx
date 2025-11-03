import "./components.css";
import Mythryl from '../assets/Mythryl.png'
import { NavLink } from "react-router";
import { logout, subscribeAuthChanges } from '../firebase/auth';
import { useEffect, useState } from "react";
import { getUserID } from "../firebase/db";

function Nav() {

  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null)
  useEffect(() => {

    const unsubscribe = subscribeAuthChanges((currentUser) => {
      if (currentUser) {
        setUser(currentUser.displayName); // yung || , kapag nag log sya manually hindi by google, temporary email nalang muna lalabas
        setImage(currentUser.photoURL);
        getUserID(currentUser.getIdToken)
      } else {
        setUser(null);
        setImage(null);
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
          <img src={Mythryl} alt="Chronica logo" />
          <NavLink to="/home">
            <h1>Chronica</h1>
          </NavLink>
        </div>

        <div className="search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            aria-label="Search"
          />
          <NavLink to='/notification'><i className="fa-solid fa-bell"></i></NavLink>
        </div>

        <div className="account-wrapper">
          {!user ? (
            <>
              <div className="account">
                <i
                  style={{ fontSize: "30px" }}
                  className="fa-solid fa-circle-user"
                ></i>
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
                {image == null ? (
                  <>
                    <i
                      style={{ fontSize: "30px" }}
                      className="fa-solid fa-circle-user"
                    ></i>
                  </>
                ) : (
                  <>
                    <img src={image} alt="" />
                  </>
                )}
                <i className="fa-solid fa-caret-down"></i>
              </div>

              <div className="nav-settings">
                <h2>{user}</h2>
                <NavLink to="">Account Settings</NavLink>
                <NavLink to="/profile">Profile Page</NavLink>
                <NavLink to="/bookmark">Reading List</NavLink>
                <NavLink to="">My Series</NavLink>
                <NavLink to="" onClick={handleLogout}>
                  Log Out
                </NavLink>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="nav2">
        {/* Conditional Render: if Homepage is accesed */}
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

          <div className="dropdown">
            <button className="dropbtn">
              Categories <i className="fa-solid fa-angle-down"></i>
            </button>
            <div className="dropdown-content">
              <div className="genre-grid">
                {/* baka i-map ko to */}
                <NavLink href="#">Action</NavLink>
                <NavLink href="#">Romance</NavLink>
                <NavLink href="#">Fantasy</NavLink>
                <NavLink href="#">Drama</NavLink>
                <NavLink href="#">Comedy</NavLink>
                <NavLink href="#">Adventure</NavLink>
                <NavLink href="#">Mystery</NavLink>
                <NavLink href="#">Sci-Fi</NavLink>
                <NavLink href="#">Slice of Life</NavLink>
                <NavLink href="#">Horror</NavLink>
                <NavLink href="#">Thriller</NavLink>
                <NavLink href="#">Historical</NavLink>
                <NavLink href="#">Supernatural</NavLink>
                <NavLink href="#">Sports</NavLink>
                <NavLink href="#">Psychological</NavLink>
              </div>
            </div>
          </div>
          <NavLink to="/about-us" className="dropbtn">
            About
          </NavLink>
        </div>

        <div className="nav2-right">
          <button className="nav2-btn">
            <i className="fa-brands fa-readme"></i> Read
          </button>
          <button className="nav2-btn">
            <i className="fa-solid fa-feather"></i> Write
          </button>
        </div>

        {/* Conditional Render:  */}
      </div>
    </>
  );
}

export default Nav