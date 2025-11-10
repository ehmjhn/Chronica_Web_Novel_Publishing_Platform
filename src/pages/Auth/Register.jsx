import "./auth.css";
import AUTH from '../../assets/AUTH.png'

import { NavLink } from "react-router";
import { useState } from "react";
import { registerUser } from "../../firebase/auth";

function Registration() {

    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [npass, setnShow] = useState(false);
    const [cpass, setcShow] = useState(false);

    const toggleNewPassword = () => setnShow(prev => !prev);
    const toggleConfirmPassword = () => setcShow(prev => !prev);

    function handleRegister() {
        
        if(!email || !password || !confirmPass || !username || !fullname){
            alert('Please fill up all fields.')
            return;
        }

        if(password !== confirmPass){
            alert('Password mismatch.')
            return;
        }

        registerUser(email, password, username, fullname)
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
              <i className="fa fa-user icon"></i>
              <input
                className="reg-input-field"
                type="text"
                placeholder="Enter your Full Name"
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
          </div>
          
          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <i className="fa fa-pen-nib icon"></i>
              <input
                className="reg-input-field"
                type="text"
                placeholder="Enter your Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <i className="fa fa-envelope icon"></i>
              <input
                className="reg-input-field"
                type="email"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <i className="fa fa-key icon"></i>
              <input
                className="reg-input-field"
                type={npass ? "text" : "password"} 
                placeholder="Must at least 8 characters"
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`fas ${npass ? "fa-eye-slash" : "fa-eye"} eye-icon`}
                onClick={toggleNewPassword}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
          </div>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <i className="fa fa-check-circle icon"></i>
              <input
                className="reg-input-field"
                type={cpass ? "text" : "password"} 
                placeholder="Re-enter your password"
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <i
                className={`fas ${cpass ? "fa-eye-slash" : "fa-eye"} eye-icon`}
                onClick={toggleConfirmPassword}
                style={{ cursor: "pointer" }}
              ></i>
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