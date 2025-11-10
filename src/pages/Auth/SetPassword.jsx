import './auth.css';
import { NavLink, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiLock } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { auth, setPasswordForGoogleUser } from '../../firebase/auth'; 
import resetbgimg from '../../assets/AUTH.png';

function SetPassword() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Toggle password visibility
  const toggleShowNew = () => setShowNew(prev => !prev);
  const toggleShowConfirm = () => setShowConfirm(prev => !prev);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate('/login'); 
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!user) {
      alert("No user found. Please login first.");
      return;
    }

    try {
      await setPasswordForGoogleUser(user, newPassword);
      alert("Password set successfully!");
      navigate('/home'); 
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="reset-card">
        <div className="reset-form">
          <FiLock className="lock-icon" />
          <h2>Set Your Password</h2>
          <p>For your security, please choose a strong password.</p>

          <form onSubmit={handleSubmit}>
            <div className="pass-container">
              <div className="password-input-container">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span className="icon-toggle" onClick={toggleShowNew}>
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="password-input-container">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="icon-toggle" onClick={toggleShowConfirm}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="submit-npassword-btn">
              Set Password
            </button>
          </form>
        </div>

        <div className="reset-img">
          <img src={resetbgimg} alt="Reset Password Illustration" />
        </div>
      </div>
    </div>
  );
}

export default SetPassword;
