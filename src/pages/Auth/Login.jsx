import "./auth.css";
import { NavLink } from "react-router";
import Mythryl from '../../assets/Mythryl.png'
import { useState } from "react";
import { loginUser } from "../../firebase/auth";

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(){
    loginUser(email, password)
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
            <div class="input-icons">
              <i class="fa fa-envelope icon"></i>
              <p>Email Address</p>
              <div className="input-field-ul">
                <input class="input-field" type="email" placeholder="your email address"
                onChange={(e)=>{setEmail(e.target.value)}}
                />
              </div>
            </div>
            <div class="input-icons">
              <i class="fa fa-key icon"></i>
              <p>Password</p>
              <div className="input-field-ul">
                <input class="input-field" type="password" placeholder="must at least 8 characters"
                onChange={(e)=>{setPassword(e.target.value)}}
                />
              </div>
            </div>
            <button onClick={handleLogin}>SIGN IN</button>
            <div className="log-link">
              <NavLink to='/forgot-password'>Forgot Password?</NavLink> |
              <NavLink to='/register'> Create Account</NavLink>
            </div>
          </div>

          <div className="login-img">
            <img src='https://img.freepik.com/premium-photo/colorful-illustration-book-with-mountain-top_900101-55218.jpg' alt="image" />
          </div>

        </div>
      
      </div>
  );
}

export default Login;
