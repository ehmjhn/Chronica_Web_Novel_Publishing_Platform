import "./auth.css";
import AUTH from "../../assets/AUTH.webp";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PasswordField from "../../components/PasswordField";
import { InlineMessage } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { registerUser, friendlyAuthError } from "../../firebase/auth";
import { isValidEmail, isStrongPassword, isBlank, LIMITS } from "../../lib/validation";

const EMPTY = {
  fullName: "",
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  function validate() {
    const next = {};

    if (isBlank(values.fullName)) next.fullName = "Please enter your full name.";
    if (isBlank(values.displayName)) next.displayName = "Please choose a username.";
    else if (values.displayName.length > LIMITS.username)
      next.displayName = `Keep the username under ${LIMITS.username} characters.`;

    if (isBlank(values.email)) next.email = "Please enter your email address.";
    else if (!isValidEmail(values.email)) next.email = "That email address looks invalid.";

    if (isBlank(values.password)) next.password = "Please choose a password.";
    else if (!isStrongPassword(values.password))
      next.password = "Your password does not meet all the requirements.";

    if (values.confirmPassword !== values.password) {
      next.confirmPassword = "The two passwords do not match.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setBusy(true);
    try {
      await registerUser({
        email: values.email.trim(),
        password: values.password,
        displayName: values.displayName.trim(),
        fullName: values.fullName.trim(),
      });

      // registerUser signs the new account out again until the address is
      // verified, so send them to sign in rather than into a protected page.
      toast.success("Account created. Check your inbox to verify your email.");
      navigate("/login", { replace: true, state: { justRegistered: true } });
    } catch (err) {
      setFormError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="register-wrapper">
      <div className="register-cont">
        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <p className="title-text">CREATE ACCOUNT</p>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <i className="fa fa-user icon" aria-hidden="true" />
              <input
                id="reg-fullname"
                className="reg-input-field"
                type="text"
                autoComplete="name"
                placeholder="Enter your Full Name"
                value={values.fullName}
                onChange={set("fullName")}
                aria-invalid={errors.fullName ? "true" : undefined}
              />
            </div>
            {errors.fullName && <span className="validation-text">{errors.fullName}</span>}
          </div>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <i className="fa fa-pen-nib icon" aria-hidden="true" />
              <input
                id="reg-username"
                className="reg-input-field"
                type="text"
                autoComplete="nickname"
                maxLength={LIMITS.username}
                placeholder="Enter your Username"
                value={values.displayName}
                onChange={set("displayName")}
                aria-invalid={errors.displayName ? "true" : undefined}
              />
            </div>
            {errors.displayName && <span className="validation-text">{errors.displayName}</span>}
          </div>

          <div className="reg-input-icons">
            <div className="reg-input-field-ul">
              <i className="fa fa-envelope icon" aria-hidden="true" />
              <input
                id="reg-email"
                className="reg-input-field"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={values.email}
                onChange={set("email")}
                aria-invalid={errors.email ? "true" : undefined}
              />
            </div>
            {errors.email && <span className="validation-text">{errors.email}</span>}
          </div>

          <PasswordField
            id="reg-password"
            label="Password"
            value={values.password}
            onChange={(value) => setValues((c) => ({ ...c, password: value }))}
            error={errors.password}
          />

          <PasswordField
            id="reg-confirm"
            label="Confirm Password"
            value={values.confirmPassword}
            onChange={(value) => setValues((c) => ({ ...c, confirmPassword: value }))}
            showRules={false}
            placeholder="Re-enter your password"
            error={errors.confirmPassword}
          />

          <InlineMessage tone="error">{formError}</InlineMessage>

          <button className="reg-btn" type="submit" disabled={busy}>
            {busy ? "Creating account…" : "REGISTER"}
          </button>

          <div className="reg-link">
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </form>

        <div className="register-img">
          <img src={AUTH} alt="" />
        </div>
      </div>
    </div>
  );
}
