import "./auth.css";
import { useState } from "react";
import { Link } from "react-router";
import { IoMdMail, IoIosArrowRoundBack } from "react-icons/io";
import { FiAlertCircle } from "react-icons/fi";
import { InlineMessage } from "../../components/States";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { forgotPass } from "../../firebase/auth";
import { isValidEmail, isBlank } from "../../lib/validation";
import resetbgimg from "../../assets/AUTH.webp";

export default function ForgotPassword() {
  const { run, busy } = useAsyncAction();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSent(false);

    if (isBlank(email)) return setError("Please enter your email address.");
    if (!isValidEmail(email)) return setError("That email address looks invalid.");

    const result = await run(() => forgotPass(email.trim()));
    if (result) setSent(true);
  }

  return (
    <div className="form-container">
      <div className="forgot-card">
        <form className="forgot-form" onSubmit={handleSubmit} noValidate>
          <FiAlertCircle className="alert-icon" aria-hidden="true" />

          <h2>Forgot Password</h2>
          <p>Enter your email and we&apos;ll send you a link to reset your password.</p>

          <div className="email-container">
            <IoMdMail className="email-icon" aria-hidden="true" />
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={error ? "true" : undefined}
            />
          </div>

          <InlineMessage tone="error">{error}</InlineMessage>

          {sent ? (
            <InlineMessage tone="success">
              If an account exists for {email}, a reset link is on its way. The link expires in
              one hour.
            </InlineMessage>
          ) : (
            <button type="submit" className="submit-email-btn" disabled={busy}>
              {busy ? "Sending…" : "Submit"}
            </button>
          )}

          <div className="back-to-login">
            <Link to="/login">
              <IoIosArrowRoundBack className="back-icon" aria-hidden="true" /> Back to login
            </Link>
          </div>
        </form>

        <div className="forgot-img">
          <img src={resetbgimg} alt="" />
        </div>
      </div>
    </div>
  );
}
