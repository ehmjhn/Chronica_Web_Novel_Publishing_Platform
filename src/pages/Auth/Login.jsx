import "./auth.css";
import { NavLink } from "react-router";
import Mythryl from '../../assets/Mythryl.png'
import { useState } from "react";
import { loginUser, signInWithGoogle } from "../../firebase/auth";

function Login() {

  // const [cpass, setcShow] = useState(false);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(){
    loginUser(email, password)
  }
  function handleGoogleLogin(){
      signInWithGoogle();
  }
  return (
    <div className="log-wrapper">
      <div className="login-cont">
        <div className="login-form">
          <div className="form-head">
            <img src={Mythryl} alt="logo" />
            <h2>LOG IN</h2>
            <p>Please Enter your Login Credentials</p>
          </div>
          <div className="input-icons">
            <i className="fa fa-envelope icon"></i>
            <p>Email Address</p>
            <div className="input-field-ul">
              <input
                className="input-field"
                type="email"
                placeholder="your email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="input-icons">
            <i className="fa fa-key icon"></i>
            <p>Password</p>
            <div className="input-field-ul">
              <input
                className="input-field"
                type="password"
                placeholder="must at least 8 characters"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <button onClick={handleLogin}>SIGN IN</button>
          <button onClick={handleGoogleLogin}>Sign in with Google</button>
          <div className="log-link">
            <NavLink to="/forgot-password">Forgot Password?</NavLink> |
            <NavLink to="/register"> Create Account</NavLink>
          </div>
        </div>

        <div className="login-img">
          <img
            src="https://img.freepik.com/premium-photo/colorful-illustration-book-with-mountain-top_900101-55218.jpg"
            alt="image"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
