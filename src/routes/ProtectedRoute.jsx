import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useAuthUser } from "../hooks/useAuthUser";
import { LoadingState, InlineMessage } from "../components/States";
import { useToast } from "../components/toast-context";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { resendVerification, logout, friendlyAuthError } from "../firebase/auth";

/** Shown when a signed-in account has not confirmed its email address. */
function VerifyEmail({ user }) {
  const toast = useToast();
  const { run, busy } = useAsyncAction();
  const [sent, setSent] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h1>Verify your email</h1>
        <p className="auth-subtext">
          We sent a verification link to <strong>{user.email}</strong>. Open it to finish setting
          up your account.
        </p>

        <InlineMessage tone="success">
          {sent ? "Verification email sent. It can take a minute to arrive." : ""}
        </InlineMessage>

        <button
          type="button"
          className="auth-submit-btn"
          disabled={busy}
          onClick={async () => {
            const result = await run(() => resendVerification(user));
            if (result) {
              setSent(true);
              toast.success("Verification email sent.");
            }
          }}
        >
          {busy ? "Sending…" : "Resend verification email"}
        </button>

        <button
          type="button"
          className="auth-alt-btn"
          onClick={async () => {
            try {
              await logout();
              toast.info("Signed out.");
            } catch (err) {
              toast.error(friendlyAuthError(err));
            }
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

/**
 * Gate for signed-in-only pages. Waits for the first auth resolution before
 * deciding, and remembers where the user was headed so login can return them.
 */
export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuthUser();
  const location = useLocation();

  if (loading) return <LoadingState label="Checking your session…" />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  // Unverified accounts cannot publish or be shown as authors, but they still
  // need a way to resend the email, so they get this screen instead of a
  // redirect that would bounce them back to /login forever.
  if (!user.emailVerified) return <VerifyEmail user={user} />;

  // A signed-in user with no database profile (e.g. the verification window
  // is still open) should not be dropped into the dashboard.
  if (!profile) {
    return (
      <div className="state-block" role="status">
        <span className="state-spinner" aria-hidden="true" />
        <p>Preparing your profile…</p>
        <Link to="/home" className="btn btn-gray">
          Go home
        </Link>
      </div>
    );
  }

  return children;
}
