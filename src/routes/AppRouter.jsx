import { BrowserRouter, Route, Routes } from "react-router";
import { AuthLayout, MainLayout } from "./NavLayouts";

// AUTH PAGES
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// MAIN PAGES
import Home from "../pages/Home/Home";
import FeaturedStories from "../pages/Home/FeaturedStories";
import LatestRelease from "../pages/Home/LatestRelease";
import PopularWorks from "../pages/Home/PopularWorks";
import Bookmark from "../pages/Reader/Bookmark";
import NotificationItem from '../components/NotificationItem';

// ERROR PAGE
import NotFound from "../pages/Error/NotFound";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="home">
            <Route index element={<Home />} /> 
            <Route path="featured-stories" element={<FeaturedStories />} />
            <Route path="latest-releases" element={<LatestRelease />} />
            <Route path="popular-works" element={<PopularWorks />} />
            <Route path="notification" element={<NotificationItem /> } />
          </Route>

          <Route index element={<Home />} />

          <Route path="bookmark" element={<Bookmark />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRouter;
