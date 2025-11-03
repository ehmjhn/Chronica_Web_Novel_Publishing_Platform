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
import ProfileSettings from '../pages/Profile/ProfileSettings';
import EditProfile from '../pages/Profile/EditProfile';
import AuthorProfile from '../pages/Profile/AuthorProfile';
import AddChapter from '../pages/Chapter/AddChapter';
import Bookmark from "../pages/Reader/Bookmark";
import Notification from '../pages/Reader/Notification';
import StoryDetails from '../pages/Story/StoryDetails';
import StoryReviews from "../pages/Story/StoryReviews";
import ViewChapter from "../pages/Story/ViewChapter";
import SearchDiscovery from '../pages/Reader/SearchDiscovery';
import About from '../pages/Info/About';
import MySeries from '../pages/Story/MySeries';
import CreateStory from "../pages/Story/CreateStory";
import ChapterList from "../pages/Story/ChapterList";
import EditChapter from "../pages/Chapter/EditChapter";
import ReadChapter from "../pages/Chapter/ReadChapter";

// ACCESS CONTROL PAGES
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// ERROR PAGE
import NotFound from "../pages/Error/NotFound";
import EditStory from "../pages/Story/EditStory";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN LAYOUT */}
        <Route element={<MainLayout />}>

          {/* NOT PROTECTED */}
          <Route index element={<Home />} />
          <Route path="home">
            <Route index element={<Home />} />
            <Route path="featured-stories" element={<FeaturedStories />} />
            <Route path="latest-releases" element={<LatestRelease />} />
            <Route path="popular-works" element={<PopularWorks />} />
          </Route>

          <Route path="about-us" element={<About />} />
          <Route path="story-details" element={<StoryDetails />} />
          <Route path="story-details/:id" element={<StoryDetails />} />
          <Route path="story-chapter-list/:id" element={<ViewChapter />} />
          <Route path="story-reviews/:id" element={<StoryReviews />} />
          <Route path="search-discovery" element={<SearchDiscovery/>}/>
          <Route path="read-chapter" element={<ReadChapter/>}/>

          {/* PROTECTED */}
          <Route path="notification" element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          } />

          <Route path="profile" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />
          <Route path="edit-profile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="author-profile" element={
            <ProtectedRoute>
              <AuthorProfile />
            </ProtectedRoute>
          } />
          <Route path="create-chapter" element={
            <ProtectedRoute> 
              <AddChapter />
            </ProtectedRoute> 
          } />

          <Route path="bookmark" element={
            <ProtectedRoute>
              <Bookmark />
            </ProtectedRoute>
          } />

          <Route path="my-series" element={
            <ProtectedRoute>
              <MySeries />
            </ProtectedRoute>
          } />

          <Route path="create-story" element={
            <ProtectedRoute>
              <CreateStory />
            </ProtectedRoute>
          } />

          <Route path="update-story" element={
            <ProtectedRoute>
              <EditStory/>
            </ProtectedRoute>
          } />

          <Route path="update-chapter-list" element={
            <ProtectedRoute>
              <ChapterList/>
            </ProtectedRoute>
          } />

          <Route path="edit-chapter" element={
            <ProtectedRoute>
              <EditChapter/>
            </ProtectedRoute>
          } />

        </Route>

        {/* AUTH LAYOUT */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="register" element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } />
          <Route path="forgot-password" element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          } />
          <Route path="reset-password" element={
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
