import './auth.css'
import { NavLink } from 'react-router';
import { FaEye } from "react-icons/fa";
// import {useState} from 'react'


function ResetPassword (){

    // const [npass,setnShow] = useState(false);
    // const handleClick2 = () =>{
    //     setnShow(!npass)
    // }

    // const [cpass,setcShow] = useState(false);
    // const handleClick1 = () =>{
    //     setcShow(!cpass)
    // }
    return(
    <div className="reset-container">
        <div className="reset=card">
            <h2>Encryption password change</h2>
            <p>We strongly suggest using a strong password</p>
                 <div className="pass-container">
                    <div className="new-password-container">
                        <input type="password" placeholder="New Password" />
                        {/* <p onClick={handleClick}><FaEye className="show-icon" /></p> */}
                    </div>
                    <div className="confirm-password-container">
                        <input type="password" placeholder="Confirm Password" />
                        {/* <p onClick={handleClick}><FaEye className="show-icon" /></p> */}
                    </div>
                  </div>
                    <button type="submit" className="submit-npassword-btn">Change password</button>
        </div>
    </div>
    );
}

export default ResetPassword