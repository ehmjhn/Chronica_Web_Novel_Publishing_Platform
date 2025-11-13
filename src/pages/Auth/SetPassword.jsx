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

  const [passValid, setPassValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numeric: false,
    special: false,
  });

  const [showPassValidation, setShowPassValidation] = useState(true);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const navigate = useNavigate();

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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    const newPassValid = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      numeric: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setPassValid(newPassValid);
    setShowPassValidation(true);

    if(Object.values(newPassValid).every(v => v === true)){
      setShowPassValidation(false);
    }

    if(confirmPassword !== ""){
      setPasswordMismatch(value !== confirmPassword);
    }
  }

  useEffect(() => {
    if(confirmPassword === ""){
      setPasswordMismatch(false);
    } else {
      setPasswordMismatch(newPassword !== confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill both fields.");
      return;
    }

    if(Object.values(passValid).includes(false)){
      alert('Password does not meet all requirements.');
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
              {showPassValidation && (
                <div className="password-validation">
                  <span className={passValid.length ? 'valid' : 'invalid'}>At least 8 characters</span>
                  <span className={passValid.uppercase ? 'valid' : 'invalid'}>Uppercase letter required</span>
                  <span className={passValid.lowercase ? 'valid' : 'invalid'}>Lowercase letter required</span>
                  <span className={passValid.numeric ? 'valid' : 'invalid'}>Numeric character required</span>
                  <span className={passValid.special ? 'valid' : 'invalid'}>Special character required</span>
                </div>
              )}
              <div className="password-input-container">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <span className="icon-toggle" onClick={toggleShowNew}>
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {passwordMismatch && <span className="validation-text">Passwords do not match</span>}
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
