import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toast-context";
import "./toast.css";

const DEFAULT_DURATION = 4000;
const MAX_VISIBLE = 4;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, { type = "info", duration = DEFAULT_DURATION } = {}) => {
      if (!message) return null;
      const id = ++nextId.current;

      setToasts((current) => [...current.slice(-(MAX_VISIBLE - 1)), { id, message, type }]);

      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration)
        );
      }
      return id;
    },
    [dismiss]
  );

  // Clear every pending timer on unmount so a dismissed provider cannot leave
  // setTimeout callbacks running against an unmounted tree.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  // The typed helpers are stable across renders so consumers can safely put
  // them in dependency arrays.
  const success = useCallback((message, options) => push(message, { ...options, type: "success" }), [push]);
  const error = useCallback((message, options) => push(message, { ...options, type: "error" }), [push]);
  const info = useCallback((message, options) => push(message, { ...options, type: "info" }), [push]);

  const value = useMemo(
    () => ({ toast: push, success, error, info, dismiss }),
    [push, success, error, info, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
            <span className="toast__icon" aria-hidden="true">
              {toast.type === "success" && <i className="fa-solid fa-circle-check" />}
              {toast.type === "error" && <i className="fa-solid fa-circle-exclamation" />}
              {toast.type === "info" && <i className="fa-solid fa-circle-info" />}
            </span>
            <p className="toast__message">{toast.message}</p>
            <button
              type="button"
              className="toast__close"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
