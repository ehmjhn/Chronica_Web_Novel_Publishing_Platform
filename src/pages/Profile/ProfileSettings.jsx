import './profile.css';
import { FaFacebook, FaInstagram, FaEnvelope, FaDiscord } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { subscribeAuthChanges } from '../../firebase/auth';
import { getUserProfile } from '../../firebase/db';
import { logout } from '../../firebase/auth';

function ProfileSettings() {

  const [userData, setUserData] = useState()
  const [loading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeAuthChanges((currentUser) => {
      
      if (currentUser) {
        getUserProfile(currentUser.uid)
          .then((data) => {
            setUserData(data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
      } else {
        setUserData(null);
        setIsLoading(false);
      }

    });

    return () => unsubscribe();
  }, []);
  
  console.log(userData)

  if(loading) return <div className="homepage"><div style={{margin: "0 auto", fontSize:"20px", color:"white"}}>Loading...</div></div>

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* LEFT SIDE */}
        <div className="profile-left">
          <div className="profile-image">
            <div className="image-circle">
              <img src={userData?.profilePic} alt={userData?.displayName} />
            </div>
            <h2>{userData?.name || "--"}</h2>
            <p>{userData?.displayName || "--"}</p>
            <p>Following: {userData?.followingCount} | Followers: {userData?.followersCount}</p>
          </div>

          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaEnvelope />
            <FaDiscord />
          </div>

          <div className="profile-nav">
            <button className="signout-btn" onClick={()=> logout()}>Log Out</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">
          <div className="profile-header">
            <h2>Personal Information</h2>
          </div>

          <div className="profile-info">
            <label>About Me</label>
            <textarea
              value={userData?.bio || "No bio yet."}
              readOnly
            />

            <label>Joined</label>
            <input type="text" value={userData?.joinedDate || "--"} readOnly />

            <label>Full Name</label>
            <input type="text" value={userData?.name || "--"} readOnly />

            <label>Username</label>
            <input type="text" value={userData?.displayName || "--"} readOnly />

            <label>Email</label>
            <input type="email" value={userData?.email || "--"} readOnly />

            <label>Contact No</label>
            <input type="text" value="0912 345 6789" readOnly />

            <label>Birthdate</label>
            <input type="text" value={userData?.bdate || "--"} readOnly />

            <label>Gender</label>
            <input type="text" value={userData?.gender || "--"} readOnly />

            <label>Location</label>
            <input type="text" value={userData?.location || "--"} readOnly />

            <div className="edit-btn-container">
              <button
                className="edit-btn"
                onClick={() => (window.location.href = '/edit-profile')}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
