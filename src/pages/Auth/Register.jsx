import "./auth.css";
import AUTH from '../../assets/AUTH.png'

import { NavLink } from "react-router";
import { useState } from "react";
import { registerUser } from "../../firebase/auth";

function Registration() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    function handleRegister() {
        
        if(!email || !password || !confirmPass || !username){
            alert('Please fill up all fields.')
            return;
        }

        if(password !== confirmPass){
            alert('Password mismatch.')
            return;
        }

        registerUser(email, password, username)
    }

  return (
    <div className="register-wrapper">
      <div className="register-cont">

        <div className="register-form">
          <div className="register-head">
            <img src="src/assets/CHRONICA.png" alt="logo" />
          </div>

          <p className='title-text'>CREATE ACCOUNT </p>
          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <input
                className="reg-input-field"
                type="text"
                placeholder="Enter your Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <i className="fa fa-user"></i>
            </div>
          </div>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <input
                className="reg-input-field"
                type="email"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="fa fa-envelope icon"></i>
            </div>
          </div>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <input
                className="reg-input-field"
                type="password"
                placeholder="Must at least 8 characters"
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="fa fa-key icon"></i>
            </div>
          </div>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <input
                className="reg-input-field"
                type="password"
                placeholder="Re-enter your password"
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <i className="fa fa-check-circle icon"></i>
            </div>
          </div>

          <button className="reg-btn" onClick={handleRegister}>REGISTER</button>

          <div className="reg-link">
            <p>Already have an account? <NavLink to="/login">Log In</NavLink></p>
          </div>
        </div>

        <div className="register-img">
          <img src={AUTH} alt="illustration" />
        </div>

      </div>
    </div>

  );
}

export default Registration;