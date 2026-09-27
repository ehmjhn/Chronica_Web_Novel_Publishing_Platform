import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import { AuthLayout, MainLayout } from "./NavLayouts";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import Home from "../pages/Home/Home";
import { LoadingState } from "../components/States";

// Route-level code splitting: the reader-facing pages land in their own chunks
// instead of one ~900 kB bundle, which fixes the build's chunk-size warning.
const FeaturedStories = lazy(() => import("../pages/Home/FeaturedStories"));
const LatestRelease = lazy(() => import("../pages/Home/LatestRelease"));
const PopularWorks = lazy(() => import("../pages/Home/PopularWorks"));
const About = lazy(() => import("../pages/Info/About"));
const Help = lazy(() => import("../pages/Info/Help"));
const StoryDetails = lazy(() => import("../pages/Story/StoryDetails"));
const StoryReviews = lazy(() => import("../pages/Story/StoryReviews"));
const ViewChapter = lazy(() => import("../pages/Story/ViewChapter"));
const ReadChapter = lazy(() => import("../pages/Chapter/ReadChapter"));
const SearchDiscovery = lazy(() => import("../pages/Reader/SearchDiscovery"));

const Notification = lazy(() => import("../pages/Reader/Notification"));
const Bookmark = lazy(() => import("../pages/Reader/Bookmark"));
const MySeries = lazy(() => import("../pages/Story/MySeries"));
const CreateStory = lazy(() => import("../pages/Story/CreateStory"));
const EditStory = lazy(() => import("../pages/Story/EditStory"));
const ChapterList = lazy(() => import("../pages/Story/ChapterList"));
const AddChapter = lazy(() => import("../pages/Chapter/AddChapter"));
const EditChapter = lazy(() => import("../pages/Chapter/EditChapter"));
const ProfileSettings = lazy(() => import("../pages/Profile/ProfileSettings"));
const EditProfile = lazy(() => import("../pages/Profile/EditProfile"));
const AuthorProfile = lazy(() => import("../pages/Profile/AuthorProfile"));

const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const SetPassword = lazy(() => import("../pages/Auth/SetPassword"));
const NotFound = lazy(() => import("../pages/Error/NotFound"));

const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public */}
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="home/featured-stories" element={<FeaturedStories />} />
            <Route path="home/latest-releases" element={<LatestRelease />} />
            <Route path="home/popular-works" element={<PopularWorks />} />

            <Route path="about-us" element={<About />} />
            <Route path="help" element={<Help />} />
            <Route path="search-discovery" element={<SearchDiscovery />} />
            <Route path="author/:id" element={<AuthorProfile />} />

            <Route path="story-details/:id" element={<StoryDetails />} />
            <Route path="story-chapter-list/:id" element={<ViewChapter />} />
            <Route path="story-reviews/:id" element={<StoryReviews />} />
            <Route path="read-chapter/:id" element={<ReadChapter />} />

            {/* Signed-in */}
            <Route path="notification" element={protect(<Notification />)} />
            <Route path="bookmark" element={protect(<Bookmark />)} />
            <Route path="my-series" element={protect(<MySeries />)} />
            <Route path="create-story" element={protect(<CreateStory />)} />
            <Route path="create-chapter/:id" element={protect(<AddChapter />)} />
            <Route path="update-story/:id" element={protect(<EditStory />)} />
            <Route path="update-chapter-list/:id" element={protect(<ChapterList />)} />
            <Route path="edit-chapter/:id" element={protect(<EditChapter />)} />
            <Route path="profile" element={protect(<ProfileSettings />)} />
            <Route path="edit-profile" element={protect(<EditProfile />)} />

            {/* 404 - kept inside the main layout so it keeps the nav chrome.
                React Router ranks static segments above the splat, so /login
                and the other auth routes still resolve to the auth layout. */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Guests only */}
          <Route element={<AuthLayout />}>
            <Route
              path="login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="forgot-password"
              element={
                <GuestRoute>
                  <ForgotPassword />
                </GuestRoute>
              }
            />
            <Route
              path="set-password"
              element={
                <GuestRoute>
                  <SetPassword />
                </GuestRoute>
              }
            />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
