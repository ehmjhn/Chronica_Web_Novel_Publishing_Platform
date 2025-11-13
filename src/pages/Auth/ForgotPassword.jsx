import './auth.css'
import { NavLink } from 'react-router';
import { forgotPass } from '../../firebase/auth';
import { IoMdMail } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from 'react';

function ForgotPassword (){

    const [email, setEmail] = useState('')
    const [emailValid, setEmailValid] = useState(true)

    function handleResetPass(){
        if(!email){
            alert("Please enter an email")
            return;
        }
        if(!emailValid){
            alert("Invalid email format")
            return;
        }
        forgotPass(email)
    }

    const handleEmailChange = (e) => {
        const value = e.target.value
        setEmail(value)
        if(value === ""){
            setEmailValid(true)
            return
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        setEmailValid(regex.test(value))
    }
    
    return(
        <div className="form-container">
            <div className="forgot-card">
                <div className="forgot-form">
                    <FiAlertCircle className="alert-icon"/>
                
                    <h2>Forgot Password</h2>
                    <p>Enter your email and we'll send you a link to reset your password</p>

                    {!emailValid && <span className="validation-text">Invalid email format</span>}
                    <div className="email-container">
                        <IoMdMail className="email-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={handleEmailChange}
                        />
                    </div>

                    <button type="submit" className="submit-email-btn" onClick={handleResetPass}>Submit</button>

                    <div className="back-to-login">
                        <NavLink to="/login"><IoIosArrowRoundBack className="back-icon" />Back to login</NavLink>
                    </div>
                </div>
                <div className="forgot-img">
                    <img src='src/assets/AUTH.png' alt="image" />
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword
