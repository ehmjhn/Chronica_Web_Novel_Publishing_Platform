import "./auth.css";
import AUTH from "../../assets/AUTH.webp";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import PasswordField from "../../components/PasswordField";
import { InlineMessage } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAuthUser } from "../../hooks/useAuthUser";
import {
  loginUser,
  signInWithGoogle,
  resendVerification,
  friendlyAuthError,
  isGoogleUser,
  hasPasswordProvider,
} from "../../firebase/auth";
import { isBlank } from "../../lib/validation";

export default function Login() {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const from = location.state?.from || "/home";
  const justRegistered = Boolean(location.state?.justRegistered);

  async function handleSignIn(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (isBlank(email) || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setBusy(true);
    try {
      const account = await loginUser(email.trim(), password);

      // An unverified account is shown the verify prompt instead of the app.
      if (!account.emailVerified) {
        setNotice("Your email address is not verified yet. Resend the link below.");
        return;
      }

      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const account = await signInWithGoogle();

      // A Google-only account can't use the email form until it has a password.
      if (isGoogleUser(account) && !hasPasswordProvider(account)) {
        navigate("/set-password", { replace: true, state: { from } });
        return;
      }

      toast.success("Signed in with Google.");
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");

    if (!user) {
      setNotice("Sign in with your email and password first, then resend verification.");
      return;
    }

    setBusy(true);
    try {
      const sent = await resendVerification(user);
      setNotice(
        sent
          ? "Verification email sent. It can take a minute to arrive."
          : "That account is already verified."
      );
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  // Already fully signed in: offer a way forward instead of a dead form.
  if (user?.emailVerified) {
    return (
      <div className="auth-page">
        <div className="auth-form-container">
          <h1>You are already signed in</h1>
          <InlineMessage tone="success">Continue where you left off.</InlineMessage>
          <Link to={from} className="auth-submit-btn">
            Go to Chronica
          </Link>
        </div>
      </div>
    );
  }

  const needsVerification = Boolean(user && !user.emailVerified);

  return (
    <div className="auth-page">
      <img src={AUTH} alt="" className="auth-image" />

      <form className="auth-form-container" onSubmit={handleSignIn} noValidate>
        <h1>Welcome back</h1>
        <p className="auth-subtext">Sign in to keep reading and publishing.</p>

        {justRegistered && (
          <InlineMessage tone="success">
            Account created. Check your inbox to verify your email, then sign in.
          </InlineMessage>
        )}

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="••••••••"
          showRules={false}
        />

        <InlineMessage tone="error">{error}</InlineMessage>
        <InlineMessage tone="info">{notice}</InlineMessage>

        {needsVerification && (
          <InlineMessage tone="error">
            This account is not verified yet, so the rest of the app is unavailable.
          </InlineMessage>
        )}

        <button type="submit" className="auth-submit-btn" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <button type="button" className="auth-alt-btn" onClick={handleGoogle} disabled={busy}>
          <i className="fa-brands fa-google" aria-hidden="true" /> Continue with Google
        </button>

        {needsVerification && (
          <button type="button" className="auth-link-btn" onClick={handleResend} disabled={busy}>
            Resend verification email
          </button>
        )}

        <Link to="/forgot-password" className="auth-link-btn">
          Forgot Password?
        </Link>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
