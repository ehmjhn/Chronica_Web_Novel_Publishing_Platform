import './auth.css';
import { NavLink } from 'react-router';
import { FaEye } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiLock } from "react-icons/fi";
import { useState } from 'react';

function ResetPassword() {
  const [npass, setnShow] = useState(false);
  const [cpass, setcShow] = useState(false);

  return (
    <div className="form-container">
      <div className="reset-card">
        <div className="reset-form">
          <FiLock className="lock-icon" />

          <h2>Reset Your Password</h2>
          <p>We strongly suggest using a strong password for your security.</p>

          <div className="pass-container">
            {/* New Password */}
            <div className="password-input-container">
              <input
                type={npass ? "text" : "password"}
                placeholder="New Password"
              />
              <FaEye
                className="show-icon"
                onClick={() => setnShow(!npass)}
              />
            </div>

            {/* Confirm Password */}
            <div className="password-input-container">
              <input
                type={cpass ? "text" : "password"}
                placeholder="Confirm Password"
              />
              <FaEye
                className="show-icon"
                onClick={() => setcShow(!cpass)}
              />
            </div>
          </div>

          <button type="submit" className="submit-npassword-btn">
            Change Password
          </button>

          <div className="back-to-login">
            <NavLink to="/login">
              <IoIosArrowRoundBack className="back-icon" />Back to Login
            </NavLink>
          </div>
        </div>

        <div className="reset-img">
          <img
            src="https://img.freepik.com/premium-photo/password-reset-concept-computer-screen-with-reset-password-interface-user-account-security-vector-illustration_655090-951487.jpg"
            alt="Reset Password Illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
