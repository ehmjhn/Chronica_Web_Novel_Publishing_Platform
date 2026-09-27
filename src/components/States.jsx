import "./components.css";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <span className="state-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ icon = "fa-book-open", title, message, action }) {
  return (
    <div className="state-block state-block--empty">
      <i className={`fa-solid ${icon}`} aria-hidden="true" />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="state-block state-block--error" role="alert">
      <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
      <h3>Unable to load</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-gray" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function InlineMessage({ tone = "info", children }) {
  if (!children) return null;
  const icon =
    tone === "error" ? "fa-circle-exclamation" : tone === "success" ? "fa-circle-check" : "fa-circle-info";
  return (
    <p className={`inline-message inline-message--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <i className={`fa-solid ${icon}`} aria-hidden="true" /> {children}
    </p>
  );
}
