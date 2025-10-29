import './auth.css'
import { NavLink } from 'react-router';
import { IoMdMail } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiAlertCircle } from "react-icons/fi";

function ForgotPassword (){
    
    return(
        <div className="form-container">
            <div className="forgot-card">
                <div className="forgot-form">
                    <FiAlertCircle className="alert-icon"/>
                
                    <h2>Forgot Password</h2>
                    <p>Enter your email and we'll send you a link to reset your password</p>

                    <div className="email-container">
                        <IoMdMail className="email-icon" />
                        <input type="email" placeholder="Email" />
                    </div>
                    {/* /* dito lalabas kung valid yung email o hindi */}
                    <p className="process-status"></p>

                    <button type="submit" className="submit-email-btn">Submit</button>

                    <div className="back-to-login">
                        <NavLink to="/login"><IoIosArrowRoundBack className="back-icon" />Back to login</NavLink>
                    </div>
                </div>
                <div className="forgot-img">
                    <img src='https://ai-previews.123rf.com/ai-txt2img/600nwm/d122b1ab-d63b-4c55-a4e4-2c7de514d36e.jpg' alt="image" />
                </div>

            </div>

        </div>
    );
}

export default ForgotPassword