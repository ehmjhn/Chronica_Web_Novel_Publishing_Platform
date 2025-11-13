import { BrowserRouter, Routes, Route } from "react-router";

// Layouts
import { AuthLayout, MainLayout } from "./NavLayouts";

// Access Control
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import SetPassword from "../pages/Auth/SetPassword";

// Home and Info Pages
import Home from "../pages/Home/Home";
import FeaturedStories from "../pages/Home/FeaturedStories";
import LatestRelease from "../pages/Home/LatestRelease";
import PopularWorks from "../pages/Home/PopularWorks";
import About from "../pages/Info/About";

// Story and Chapter Pages
import StoryDetails from "../pages/Story/StoryDetails";
import StoryReviews from "../pages/Story/StoryReviews";
import MySeries from "../pages/Story/MySeries";
import CreateStory from "../pages/Story/CreateStory";
import EditStory from "../pages/Story/EditStory";
import ChapterList from "../pages/Story/ChapterList";
import AddChapter from "../pages/Chapter/AddChapter";
import EditChapter from "../pages/Chapter/EditChapter";
import ReadChapter from "../pages/Chapter/ReadChapter";
import ViewChapter from "../pages/Story/ViewChapter";

// Profile Pages
import ProfileSettings from "../pages/Profile/ProfileSettings";
import EditProfile from "../pages/Profile/EditProfile";
import AuthorProfile from "../pages/Profile/AuthorProfile";

// Reader Pages
import Bookmark from "../pages/Reader/Bookmark";
import Notification from "../pages/Reader/Notification";
import SearchDiscovery from "../pages/Reader/SearchDiscovery";

// Error Page
import NotFound from "../pages/Error/NotFound";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN LAYOUT */}
        <Route element={<MainLayout />}>

          {/* Public pages */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="home/featured-stories" element={<FeaturedStories />} />
          <Route path="home/latest-releases" element={<LatestRelease />} />
          <Route path="home/popular-works" element={<PopularWorks />} />

          <Route path="about-us" element={<About />} />
          <Route path="story-details" element={<StoryDetails />} />
          <Route path="story-details/:id" element={<StoryDetails />} />
          <Route path="story-chapter-list/:id" element={<ViewChapter />} />
          <Route path="story-reviews/:id" element={<StoryReviews />} />
          <Route path="search-discovery" element={<SearchDiscovery />} />
          <Route path="read-chapter/:id" element={<ReadChapter />} />

          {/* Protected pages */}
          <Route path="notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          <Route path="edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="author-profile" element={<ProtectedRoute><AuthorProfile /></ProtectedRoute>} />
          <Route path="create-chapter" element={<ProtectedRoute><AddChapter /></ProtectedRoute>} />
          <Route path="create-chapter/:id" element={<ProtectedRoute><AddChapter /></ProtectedRoute>} />
          <Route path="bookmark" element={<ProtectedRoute><Bookmark /></ProtectedRoute>} />
          <Route path="my-series" element={<ProtectedRoute><MySeries /></ProtectedRoute>} />
          <Route path="create-story" element={<ProtectedRoute><CreateStory /></ProtectedRoute>} />
          <Route path="update-story/:id" element={<ProtectedRoute><EditStory /></ProtectedRoute>} />
          <Route path="update-chapter-list/:id" element={<ProtectedRoute><ChapterList /></ProtectedRoute>} />
          <Route path="edit-chapter/:id" element={<ProtectedRoute><EditChapter /></ProtectedRoute>} />

        </Route>

        {/* AUTH LAYOUT (Guest Only) */}
        <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="set-password" element={<SetPassword />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;