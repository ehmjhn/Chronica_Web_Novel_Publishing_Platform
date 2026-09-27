// Input validation shared between the auth forms and the UI.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { key: "uppercase", label: "Uppercase letter required", test: (v) => /[A-Z]/.test(v) },
  { key: "lowercase", label: "Lowercase letter required", test: (v) => /[a-z]/.test(v) },
  { key: "numeric", label: "Numeric character required", test: (v) => /[0-9]/.test(v) },
  {
    key: "special",
    label: "Special character required",
    test: (v) => /[!@#$%^&*(),.?":{}|<>[\]\\;'`~_+=\-/]/.test(v),
  },
];

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || "").trim());
}

export function checkPasswordRules(value) {
  return PASSWORD_RULES.reduce(
    (acc, rule) => ({ ...acc, [rule.key]: rule.test(value || "") }),
    {}
  );
}

export function isStrongPassword(value) {
  return Object.values(checkPasswordRules(value)).every(Boolean);
}

export function isBlank(value) {
  return !String(value ?? "").trim();
}

export const LIMITS = {
  title: 100,
  chapterTitle: 150,
  synopsis: 2000,
  bio: 500,
  reviewTopic: 120,
  reviewMessage: 2000,
  username: 30,
  displayName: 50,
  genre: 7,
  tags: 7,
};

export function truncate(value, max) {
  const str = String(value ?? "");
  return str.length > max ? `${str.slice(0, max)}…` : str;
}
