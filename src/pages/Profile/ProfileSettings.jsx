import React from 'react';
import './profile.css';
import './profile-settings.css'; // optional if you have more overrides

function ProfileSettings() {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="your-profile-pic.jpg" alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <h2>Jhaezer Anne David</h2>
          <p>Following: 10 &nbsp; Followers: 999</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="about-section">
          <h4>About me</h4>
          <p>Ramdam kong nag-init ka lalo na’t ‘pag lasing ka...</p>
          <p className="joined-date">Joined: July 2023</p>
        </div>

        <div className="info-section">
          <div className="info-row">
            <div className="info-field">
              <label>Full Name</label>
              <p>Jhaezer Anne David</p>
            </div>
            <div className="info-field">
              <label>Birthdate</label>
              <p>April 15, 2004</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-field">
              <label>Email</label>
              <p>jhaezer@example.com</p>
            </div>
            <div className="info-field">
              <label>Gender</label>
              <p>Female</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-field">
              <label>Location</label>
              <p>Bulacan</p>
            </div>
            <div className="info-field">
              <label>Username</label>
              <p>@jhaezer</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-field full">
              <label>Contact No</label>
              <p>0912 345 6789</p>
            </div>
          </div>

          <div className="profile-actions">
            <div className="social-icons">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fas fa-envelope"></i>
              <i className="fab fa-discord"></i>
            </div>
            <button className="edit-btn">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
