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
import ProfileSettings from '../pages/Profile/ProfileSettings'
import EditProfile from '../pages/Profile/EditProfile';
import AuthorProfile from '../pages/Profile/AuthorProfile';
import AddChapter from '../pages/Story/AddChapter';

import Bookmark from "../pages/Reader/Bookmark";
import NotificationItem from '../components/NotificationItem';
import StoryDetails from '../pages/Story/StoryDetails';
import StoryReviews from "../pages/Story/StoryReviews";
import ChapterList from "../pages/Story/ChapterList";
import SearchDiscovery from '../pages/Reader/SearchDiscovery';

// ACCESSS CONTROL PAGE
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

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
          </Route>

          <Route path="notification" 
              element={
              <ProtectedRoute>
                <NotificationItem />
              </ProtectedRoute> } 
            />
            
            <Route path="profile" 
              element={
              <ProtectedRoute>
                <ProfileSettings/>
              </ProtectedRoute>
            } 
            />
            <Route path="edit-profile" 
              element={
              <ProtectedRoute>
                <EditProfile/>
              </ProtectedRoute>
            }  
            />
            <Route path="author-profile" 
              element={
              <ProtectedRoute>
                <AuthorProfile/>
              </ProtectedRoute>
            } 
            />

            <Route path="add-chapter" 
              element={
              <ProtectedRoute>
                <AddChapter/>
              </ProtectedRoute>
            } 
            />

            <Route path="search-discovery" 
              element={
                <ProtectedRoute>
                <SearchDiscovery/>
              </ProtectedRoute>
            } 
            />
            <Route path="bookmark" 
              element={
                <ProtectedRoute>
                <Bookmark/>
              </ProtectedRoute>
            } 
            />
            
            <Route path="story-details" element={<StoryDetails/>}/>
            <Route path="story-chapter-list" element={<ChapterList/>}/>
            <Route path="story-reviews" element={<StoryReviews/>}/>
        
          <Route index element={<Home />} />

        </Route>

        <Route element={<AuthLayout />}>
    
          <Route path="login" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />

          <Route path="register" 
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } />

          <Route path="forgot-password" 
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          } />

          <Route path="reset-password" 
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          } />
          
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRouter;
