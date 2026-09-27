import { Navigate, useLocation } from "react-router";
import { useAuthUser } from "../hooks/useAuthUser";
import { hasPasswordProvider, isGoogleUser } from "../firebase/auth";
import { LoadingState } from "../components/States";

/**
 * Gate for the auth pages. Signed-in visitors are sent onward:
 *  - Google accounts without a password are pushed to /set-password so they
 *    can also sign in with email.
 *  - Everyone else lands on the page they originally requested, or /home.
 */
export default function GuestRoute({ children }) {
  const { user, profile, loading } = useAuthUser();
  const location = useLocation();

  if (loading) return <LoadingState label="Loading…" />;
  if (!user) return children;

  const destination = location.state?.from || "/home";

  // A Google account with no password must set one before it can use the rest
  // of the app — but let it see the set-password page itself.
  if (isGoogleUser(user) && !hasPasswordProvider(user)) {
    return location.pathname === "/set-password" ? (
      children
    ) : (
      <Navigate to="/set-password" replace />
    );
  }

  // An unverified account is shown /login so the page can offer "resend
  // verification" and a sign-out. Redirecting to /login from /login was a
  // self-redirect loop that made the verification flow unreachable.
  if (!user.emailVerified) {
    return location.pathname === "/login" ? (
      children
    ) : (
      <Navigate to="/login" replace state={{ needsVerification: true }} />
    );
  }

  // A Google user who just linked a password has no profile row yet.
  if (!profile) return <LoadingState label="Preparing your profile…" />;

  return <Navigate to={destination} replace />;
}
