import './profile.css'
import './edit-profile.css'

// me na here - david (medj auzin ko pa 'to wit)
function EditProfile (){

    return(
    <div class="profile-container">
        <div class="profile-header">
            <img src="your-profile-pic.jpg" alt="Profile Picture" class="profile-pic" />
            <div class="profile-info">
            <h2>Edit Profile</h2>
            <p>Make changes to your information below</p>
            </div>
        </div>

        <div class="profile-content">
            <div class="about-section">
            <h4>About Me</h4>
            <textarea placeholder="Write something about yourself...">Ramdam kong nag-init ka lalo na’t ‘pag lasing ka...</textarea>
            <p>Joined: July 2023</p>
            </div>

            <div class="info-section">
            <div class="info-row">
                <div class="info-field">
                <label>Full Name</label>
                <input type="text" value="Jhaezer Anne David" />
                </div>
                <div class="info-field">
                <label>Birthdate</label>
                <input type="date" value="2004-04-15" />
                </div>
            </div>

            <div class="info-row">
                <div class="info-field">
                <label>Email</label>
                <input type="email" value="jhaezer@example.com" />
                </div>
                <div class="info-field">
                <label>Gender</label>
                <select>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                </select>
                </div>
            </div>

            <div class="info-row">
                <div class="info-field">
                <label>Location</label>
                <input type="text" value="Bulacan" />
                </div>
                <div class="info-field">
                <label>Username</label>
                <input type="text" value="@jhaezer" />
                </div>
            </div>

            <div class="info-row">
                <div class="info-field full">
                <label>Contact No</label>
                <input type="text" value="0912 345 6789" />
                </div>
            </div>

            <div class="profile-actions">
                <div class="social-icons">
                <i class="fab fa-facebook"></i>
                <i class="fab fa-instagram"></i>
                <i class="fas fa-envelope"></i>
                <i class="fab fa-discord"></i>
                </div>
                <div class="btn-group">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save Changes</button>
                </div>
            </div>
            </div>
        </div>
    </div>


    );
}

export default EditProfile