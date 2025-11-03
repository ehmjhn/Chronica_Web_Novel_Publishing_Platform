import './routes.css'
import { Outlet } from "react-router";
import Nav from '../components/Nav';
import Footer from '../components/Footer'
import Mythryl from '../assets/Mythryl.png'

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
            <img src="src/assets/CHRONICA.png" alt="logo" />
        </div>

        <main>
          <Outlet />
        </main>

        <div className='footer'>
              <p>© Website Name | Developers Team | All Rights Reserved 2025</p>
        </div>
      </div>
  );
}
