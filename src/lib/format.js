// Formatting and small data-shaping helpers.

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? numberFormatter.format(n) : "0";
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const count = Math.floor(seconds / unit.seconds);
    if (count >= 1) return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function daysSince(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY;
  return (Date.now() - date.getTime()) / 86400000;
}

export function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return Object.values(value);
  return [value];
}

export function displayNameOf(user) {
  if (!user) return "Unknown";
  return user.displayName || user.name || "Unknown";
}

export function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function pageCount(total, perPage) {
  if (!perPage || total <= 0) return 1;
  return Math.max(1, Math.ceil(total / perPage));
}

export function byIdDesc(a, b, field = "createdAt") {
  return new Date(b[field] || 0) - new Date(a[field] || 0);
}

export function byNumberDesc(field) {
  return (a, b) => (b[field] || 0) - (a[field] || 0);
}
