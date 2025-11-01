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
            <h2>CREATE ACCOUNT</h2>
            <p>Please fill in your details to register</p>
          </div>

          <div className="reg-input-icons">
            <p>Pen Name</p>
            <div className="reg-input-field-ul">
              <input
                className="reg-input-field"
                type="text"
                placeholder="your pen name"
                onChange={(e) => setUsername(e.target.value)}
              />
              <i className="fa fa-envelope icon"></i>
            </div>
          </div>

          <div className="reg-input-icons">
            <p>Email Address</p>
            <div className="reg-input-field-ul">
              <input
                className="reg-input-field"
                type="email"
                placeholder="your email address"
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="fa fa-envelope icon"></i>
            </div>
          </div>

          <div className="reg-input-icons">
            <p>Password</p>
            <div className="reg-input-field-ul">
              <input
                className="reg-input-field"
                type="password"
                placeholder="must at least 8 characters"
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="fa fa-key icon"></i>
            </div>
          </div>

          <div className="reg-input-icons">
            <p>Confirm Password</p>
            <div className="reg-input-field-ul">
              <input
                className="reg-input-field"
                type="password"
                placeholder="re-enter your password"
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