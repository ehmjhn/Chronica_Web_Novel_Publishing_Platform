import './profile.css';
import { FaFacebook, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";
import { NavLink } from 'react-router';
import { useState, useEffect } from 'react';
import { subscribeAuthChanges } from '../../firebase/auth';
import { getUserProfile } from '../../firebase/db';
import { updateUserProfile } from '../../firebase/db';  

function EditProfile() {
  const [userData, setUserData] = useState();
  const [editData, setEditData] = useState();
  const [loading, setIsLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeAuthChanges((currentUser) => {
      if (currentUser) {
        setCurrentUid(currentUser.uid);

        getUserProfile(currentUser.uid)
          .then((data) => {
            if (data) {
              setUserData(data);
              setEditData(data);
            } else {
              console.log("No user data found");
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
        setUserData(null);
        setEditData(null);
        setCurrentUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="homepage">
        <div style={{ margin: "0 auto", fontSize: "20px", color: "white" }}>
          Loading...
        </div>
      </div>
    );

  // handle editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // save button 
  const handleSave = () => {
    if (!editData || !currentUid) return;

    updateUserProfile(currentUid, editData)
      .then(() => {
        setUserData(editData); 
        alert("Profile updated successfully!");
        window.location.href = '/profile'
      })
      .catch((error) => {
        console.error(error);
        alert("Error updating profile: " + error.message);
      });
  };

  return (
    <div className="edit-profile-wrapper">
      <div className="edit-profile-card">
        {/* LEFT SIDE */}
        <div className="edit-left">
          <div className="profile-image">
            <div className="image-circle">
              <img src={userData?.profileImage || "https://via.placeholder.com/150"} alt="Profile" />
            </div>
            <h2>{userData?.name || "--"}</h2>
            <p>{userData?.displayName || "--"}</p>
          </div>

          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTiktok />
            <FaEnvelope />
          </div>

          <div className="profile-nav">
            <button className="signout-btn">Upload Photo</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="edit-right">
          <div className="edit-header">
            <h2>Edit Personal Information</h2>
          </div>

          <div className="edit-info">
            <label>About Me</label>
            <textarea
              name="bio"
              value={editData?.bio || ""}
              onChange={handleChange}
            />

            <label>Date Joined</label>
            <input
              type="text"
              name="joinedDate"
              value={editData?.joinedDate || ""}
              disabled
            />

            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={editData?.name || ""}
              onChange={handleChange}
            />

            <label>Username</label>
            <input
              type="text"
              name="displayName"
              value={editData?.displayName || ""}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editData?.email || ""}
              disabled
            />

            <label>Birthdate</label>
            <input
              type="date"
              name="bdate"
              value={editData?.bdate || ""}
              onChange={handleChange}
            />

            <label>Gender</label>
            <select name="gender" value={editData?.gender || ""} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>

            <label>Location</label>
            <input
              type="text"
              name="location"
              value={editData?.location || ""}
              onChange={handleChange}
            />

            <label>Contact No</label>
            <input
              type="text"
              name="contactNo"
              value={editData?.contactNo || ""}
              onChange={handleChange}
            />

            <div className="save-container">
              <NavLink to='/profile' className="cancel-btn">Cancel</NavLink>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
