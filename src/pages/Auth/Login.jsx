import "./auth.css";
import AUTH from "../../assets/AUTH.png";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import { auth, loginUser, signInWithGoogle } from "../../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pass, setShowPass] = useState(false);

  const [emailValid, setEmailValid] = useState(true);



  function handleLogin() {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    if (!emailValid) {
      alert("Invalid email format");
      return;
    }
    loginUser(email, password);
  }

  function handleGoogleLogin() {
    signInWithGoogle();
  }

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value === "") {
      setEmailValid(true);
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(regex.test(value));
  }



  return (
    <div className="login-page">
      <div className="log-wrapper">
        <div className="login-cont">
          <div className="login-img">
            <img src={AUTH} alt="image" />
          </div>

          <div className="login-form">
            <div className="form-head">
              <img src="src/assets/CHRONICA.png" alt="logo" />
            </div>

            <p className="login-text">Please enter your Login credentials</p>

            <div className="input-icons">
              {!emailValid && <span className="validation-text">Invalid email format</span>}
              <div className="input-field-ul">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  className="input-field"
                  type="email"
                  placeholder="Email"
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            <div className="input-icons">
              <div className="input-field-ul">
                <i className="fas fa-lock input-icon"></i>
                <input
                  className="input-field"
                  type={pass ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i
                  className={`fas ${pass ? "fa-eye-slash" : "fa-eye"} eye-icon`}
                  onClick={() => setShowPass(!pass)}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            </div>

            <button onClick={handleLogin}>SIGN IN</button>
            <button className="google-login-btn" onClick={handleGoogleLogin}>
              <i className="fab fa-google"></i> Sign in with Google
            </button>

            <div className="log-link">
              <NavLink to="/register">Create Account</NavLink> |{" "}
              <NavLink to="/forgot-password">Forgot Password?</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
