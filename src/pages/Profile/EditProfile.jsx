import './profile.css';
import { FaFacebook, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";

function EditProfile() {
  return (
    <div className="edit-profile-wrapper">
      <div className="edit-profile-card">
        {/* LEFT SIDE */}
        <div className="edit-left">
          <div className="profile-image">
            <div className="image-circle">
              <img src="https://via.placeholder.com/150" alt="Profile" />
            </div>
            <h2>Jhaezer Anne David</h2>
            <p>@jhaezer</p>
          </div>

          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTiktok />
            <FaEnvelope />
          </div>

          <div className="profile-nav">
            <button className="signout-btn">Sign Out</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="edit-right">
          <div className="edit-header">
            <h2>Edit Personal Information</h2>
          </div>

          <div className="edit-info">
            <label>About Me</label>
            <textarea defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit..." />

            <label>Full Name</label>
            <input type="text" defaultValue="Jhaezer Anne David" />

            <label>Username</label>
            <input type="text" defaultValue="@jhaezer" />

            <label>Email</label>
            <input type="email" defaultValue="user@gmail.com" />

            <label>Password</label>
            <input type="password" defaultValue="**************" />

            <label>Birthdate</label>
            <input type="date" defaultValue="2004-04-15" />

            <label>Gender</label>
            <input type="text" defaultValue="Female" />

            <label>Location</label>
            <input type="text" defaultValue="Bulacan" />

            <label>Contact No</label>
            <input type="text" defaultValue="0912 345 6789" />

            <label>Date Joined</label>
            <input type="text" defaultValue="July 2023" disabled />

            <div className="save-container">
              <button className="save-btn">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
