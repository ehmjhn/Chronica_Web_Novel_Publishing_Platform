import './components.css'

function Footer (){

    return(
        <>
            <div className="above-footer">
                <div className="about-box">
                    <h3>About</h3>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                    commodo velit ex, non iaculis ipsum molestie eget.
                    </p>
                </div>

                <div className="social-box">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                    <i className="fa fa-instagram"></i>
                    <i className="fa fa-youtube"></i>
                    <i className="fa fa-facebook"></i>
                    <i className="fa fa-twitter"></i>
                    <i className="fa fa-music"></i>
                    </div>
                </div>

                <div className="contact-box">
                    <h3>Contact</h3>
                    <p>Send us feedback<br />Contact Us</p>
                </div>

                <div className="ads-box">
                    <h3>Advertising</h3>
                    <p>
                    Media Demo: Help?<br />
                    Email: sample@email.com
                    </p>
                </div>
                </div>

                <footer>
                <p>© Website Name | Developers Team | All Rights Reserved 2025</p>
                </footer>

        </>
    );
}

export default Footer