import "./auth.css";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FiLock } from "react-icons/fi";
import PasswordField from "../../components/PasswordField";
import { InlineMessage, LoadingState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { setPasswordForGoogleUser, friendlyAuthError, hasPasswordProvider } from "../../firebase/auth";
import { isStrongPassword, isBlank } from "../../lib/validation";
import resetbgimg from "../../assets/AUTH.webp";

export default function SetPassword() {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { run, busy } = useAsyncAction();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const from = location.state?.from || "/home";

  if (loading) return <LoadingState label="Checking your account…" />;

  if (!user) {
    return (
      <div className="form-container">
        <div className="reset-card">
          <div className="reset-form">
            <h2>Sign in first</h2>
            <p>You need to be signed in to set a password on your account.</p>
            <Link to="/login" className="submit-npassword-btn">
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hasPasswordProvider(user)) {
    return (
      <div className="form-container">
        <div className="reset-card">
          <div className="reset-form">
            <h2>You already have a password</h2>
            <p>Use “Forgot Password?” on the sign-in page to change it.</p>
            <Link to={from} className="submit-npassword-btn">
              Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function validate() {
    const next = {};
    if (isBlank(password)) next.password = "Please choose a password.";
    else if (!isStrongPassword(password))
      next.password = "Your password does not meet all the requirements.";
    if (password !== confirmPassword) next.confirmPassword = "The two passwords do not match.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    const result = await run(() => setPasswordForGoogleUser(user, password));
    if (result) {
      toast.success("Password set. You can now sign in with your email.");
      navigate(from, { replace: true });
    } else {
      setFormError(friendlyAuthError(new Error("Could not set the password.")));
    }
  }

  return (
    <div className="form-container">
      <div className="reset-card">
        <form className="reset-form" onSubmit={handleSubmit} noValidate>
          <FiLock className="lock-icon" aria-hidden="true" />
          <h2>Set Your Password</h2>
          <p>
            You signed in with Google. Add a password so you can also sign in with{" "}
            <strong>{user.email}</strong>.
          </p>

          <PasswordField
            id="set-password"
            label="New password"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />

          <PasswordField
            id="set-confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showRules={false}
            placeholder="Re-enter your new password"
            error={errors.confirmPassword}
          />

          <InlineMessage tone="error">{formError}</InlineMessage>

          <button type="submit" className="submit-npassword-btn" disabled={busy}>
            {busy ? "Saving…" : "Set Password"}
          </button>
        </form>

        <div className="reset-img">
          <img src={resetbgimg} alt="" />
        </div>
      </div>
    </div>
  );
}
