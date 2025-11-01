import './components.css'

function Footer (){

    return(
        <>
            <div className="above-footer">
                <div className="above-footer">

                    <div className="footer-column about-box">
                    <h3>About Chronica</h3>
                    <p>
                        Chronica is a Creative Content Management and Distribution System for
                        authors, creators, and publishers. Streamline your storytelling,
                        track readership, and distribute content seamlessly.
                    </p>
                    <ul>
                        <li>Manage and organize your stories</li>
                        <li>Track chapter updates and analytics</li>
                        <li>Engage with your audience</li>
                        <li>Distribute content across multiple platforms</li>
                    </ul>
                    </div>

                    <div className="footer-column links-box">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/stories">Stories</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                    </div>

                    <div className="footer-column social-box">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <i className="fa-brands fa-facebook"></i>
                        <i className="fa-brands fa-youtube"></i>
                        <i className="fa-brands fa-square-instagram"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-discord"></i>
                    </div>
                    </div>

                    <div className="footer-column contact-box">
                    <h3>Contact & Ads</h3>
                    <p>Email: support@chronica.com</p>
                    <p>Advertising: ads@chronica.com</p>
                    <p>Phone: +1 234 567 890</p>
                    </div>

                </div>
            </div>

            <footer>
                <p class="footer-brand">Chronica</p>
                <p>© 2025 ISIP KAYO PANGALAN NATIN AS A GROUP PLSS. All Rights Reserved.</p>
                <div class="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/contact">Contact</a>
                </div>
            </footer>

        </>
    );
}

export default Footer