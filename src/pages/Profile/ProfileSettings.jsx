import './profile.css';
import { FaFacebook, FaInstagram, FaEnvelope, FaDiscord } from "react-icons/fa";

function ProfileSettings() {
  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* LEFT SIDE */}
        <div className="profile-left">
          <div className="profile-image">
            <div className="image-circle">
              <img src="your-profile-pic.jpg" alt="Profile" />
            </div>
            <h2>Jhaezer Anne David</h2>
            <p>@jhaezer</p>
            <p>Following: 10 | Followers: 999</p>
          </div>

          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaEnvelope />
            <FaDiscord />
          </div>

          <div className="profile-nav">
            <button className="signout-btn">Sign Out</button>
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
              value="Ramdam kong nag-init ka lalo na’t ‘pag lasing ka..."
              readOnly
            />

            <label>Joined</label>
            <input type="text" value="July 2023" readOnly />

            <label>Full Name</label>
            <input type="text" value="Jhaezer Anne David" readOnly />

            <label>Birthdate</label>
            <input type="text" value="April 15, 2004" readOnly />

            <label>Email</label>
            <input type="email" value="jhaezer@example.com" readOnly />

            <label>Gender</label>
            <input type="text" value="Female" readOnly />

            <label>Location</label>
            <input type="text" value="Bulacan" readOnly />

            <label>Username</label>
            <input type="text" value="@jhaezer" readOnly />

            <label>Contact No</label>
            <input type="text" value="0912 345 6789" readOnly />

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
