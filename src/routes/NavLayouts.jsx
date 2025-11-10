import './routes.css'
import { Outlet } from "react-router";
import Nav from '../components/Nav';
import Footer from '../components/Footer'
import { NavLink } from 'react-router';

export function MainLayout(){
    return (
      <>
        <Nav />
        <main>
          <Outlet />
        </main>
        <Footer />
      </>
    );
}

export function AuthLayout() {
  return (
      <div className="background">
        <div className="header">
          <NavLink to="/home">
            <img src="src/assets/CHRONICA.png" alt="Chronica logo" />
          </NavLink>
        </div>

        <main>
          <Outlet />
        </main>

        <div className="footer">
          <div className="footer-top">
            <p className="footer-brand">Chronica</p>
            <p className="footer-copy">
              © 2025 Paranoic Software Solutions. All Rights Reserved.
            </p>
          </div>

          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/contact" className="footer-link">Contact</a>
          </div>
        </div>
      </div>
  );
}
