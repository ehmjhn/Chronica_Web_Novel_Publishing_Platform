import './reset.css';
import { NavLink } from 'react-router';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiLock } from "react-icons/fi";
import { useState } from 'react';
import resetbgimg from '../assets/chronicaimg.png';

function ResetPassword() {
  const [npass, setnShow] = useState(false);
  const [cpass, setcShow] = useState(false);

  const toggleNewPassword = () => setnShow(prev => !prev);
  const toggleConfirmPassword = () => setcShow(prev => !prev);

  return (
    <div className="form-container">
      <div className="reset-card">
        {/* Left Side - Form */}
        <div className="reset-form">
          <FiLock className="lock-icon" />
          <h2>RESET YOUR PASSWORD</h2>
          <p>We strongly suggest using a strong password for your security.</p>

          <div className="pass-container">
            {/* New Password */}
            <div className="password-input-container">
              <input
                type={npass ? "text" : "password"}
                placeholder="New password"
              />
              <span className="icon-toggle" onClick={toggleNewPassword}>
                {npass ? <FaEyeSlash className="show-icon" /> : <FaEye className="show-icon" />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="password-input-container">
              <input
                type={cpass ? "text" : "password"}
                placeholder="Confirm password"
              />
              <span className="icon-toggle" onClick={toggleConfirmPassword}>
                {cpass ? <FaEyeSlash className="show-icon" /> : <FaEye className="show-icon" />}
              </span>
            </div>
          </div>

          <button type="submit" className="submit-npassword-btn">
            Change password
          </button>

          <div className="back-to-login">
            <NavLink to="/login">
              <IoIosArrowRoundBack className="back-icon" /> Back to login
            </NavLink>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="reset-img">
          <img
            src={resetbgimg}
            alt="Reset Password Illustration"
          />
        </div>
      </div>
    </div>
  );
}


export default ResetPassword;

