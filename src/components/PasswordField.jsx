import { useId, useState } from "react";
import "./password-field.css";
import { PASSWORD_RULES, checkPasswordRules } from "../lib/validation";

/**
 * Password input with an optional live rules checklist.
 *
 * The rules were duplicated by hand in Register and SetPassword, and the two
 * copies had drifted (different special-character sets). Both now render this,
 * so the hint a user sees is always the rule the form actually enforces.
 */
export default function PasswordField({
  id,
  label = "Password",
  value,
  onChange,
  autoComplete = "new-password",
  showRules = true,
  error,
  placeholder = "Enter your password",
}) {
  const generatedId = useId();
  const inputId = id || `password-${generatedId}`;
  const [visible, setVisible] = useState(false);

  const results = checkPasswordRules(value);
  const satisfied = PASSWORD_RULES.every((rule) => results[rule.key]);
  // Hide the checklist once the password is valid and long enough to be useful.
  const showChecklist = showRules && value.length > 0 && !satisfied;

  return (
    <div className="password-field">
      <label htmlFor={inputId}>{label}</label>

      <div className="password-field__control">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={showChecklist ? `${inputId}-rules` : undefined}
        />
        <button
          type="button"
          className="password-field__toggle"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          <i className={`fa-solid ${visible ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
        </button>
      </div>

      {showChecklist && (
        <ul className="password-rules" id={`${inputId}-rules`}>
          {PASSWORD_RULES.map((rule) => (
            <li key={rule.key} className={results[rule.key] ? "is-valid" : "is-invalid"}>
              <i
                className={`fa-solid ${results[rule.key] ? "fa-circle-check" : "fa-circle"}`}
                aria-hidden="true"
              />
              {rule.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="password-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
