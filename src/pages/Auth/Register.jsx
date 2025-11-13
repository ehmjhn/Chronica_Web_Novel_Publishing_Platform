import "./auth.css";
import AUTH from '../../assets/AUTH.png'

import { NavLink } from "react-router";
import { useState, useEffect } from "react";
import { registerUser } from "../../firebase/auth";

function Registration() {

    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [npass, setnShow] = useState(false);
    const [cpass, setcShow] = useState(false);

    const [emailValid, setEmailValid] = useState(true);
    const [passValid, setPassValid] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        numeric: false,
        special: false,
    });

    const [showPassValidation, setShowPassValidation] = useState(true);
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const toggleNewPassword = () => setnShow(prev => !prev);
    const toggleConfirmPassword = () => setcShow(prev => !prev);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if(value === "") {
            setEmailValid(true);
            return;
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(regex.test(value));
    }

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const newPassValid = {
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            numeric: /[0-9]/.test(value),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
        };

        setPassValid(newPassValid);
        setShowPassValidation(true);

        if(Object.values(newPassValid).every(v => v === true)) {
          setShowPassValidation(false);
        }
    }

    useEffect(() => {
        if(confirmPass === "") {
            setPasswordMismatch(false);
        } else {
            setPasswordMismatch(password !== confirmPass);
        }
    }, [password, confirmPass]);

    function handleRegister() {
        if(!email || !password || !confirmPass || !username || !fullname){
            alert('Please fill up all fields.')
            return;
        }

        if(!emailValid){
            alert('Invalid email format.');
            return;
        }

        if(Object.values(passValid).includes(false)){
            alert('Password does not meet all requirements.');
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
            {!emailValid && <span className="validation-text">Invalid email format</span>}
            <div className="reg-input-field-ul">
              <i className="fa fa-envelope icon"></i>
              <input
                className="reg-input-field"
                type="email"
                placeholder="Enter your email address"
                onChange={handleEmailChange}
              />
            </div>
          </div>

          <div className="reg-input-icons">
            {showPassValidation && (
              <div className="password-validation">
                <span className={passValid.length ? 'valid' : 'invalid'}>At least 8 characters</span>
                <span className={passValid.uppercase ? 'valid' : 'invalid'}>Uppercase letter required</span>
                <span className={passValid.lowercase ? 'valid' : 'invalid'}>Lowercase letter required</span>
                <span className={passValid.numeric ? 'valid' : 'invalid'}>Numeric character required</span>
                <span className={passValid.special ? 'valid' : 'invalid'}>Special character required</span>
              </div>
            )}
            <div className="reg-input-field-ul">
              <i className="fa fa-key icon"></i>
              <input
                className="reg-input-field"
                type={npass ? "text" : "password"} 
                placeholder="Must at least 8 characters"
                onChange={handlePasswordChange}
              />
              <i
                className={`fas ${npass ? "fa-eye-slash" : "fa-eye"} eye-icon`}
                onClick={toggleNewPassword}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
          </div>

          <div className="reg-input-icons">
            {passwordMismatch && <span className="validation-text">Passwords do not match</span>}
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
