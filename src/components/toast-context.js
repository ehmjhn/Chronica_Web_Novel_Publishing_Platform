import { createContext, useContext } from "react";

/**
 * Toast context lives apart from ToastProvider so that Toast.jsx exports only
 * components. A module mixing components and plain exports breaks React Fast
 * Refresh, so the dev server would stop hot-updating on every toast change.
 */
export const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a <ToastProvider>.");
  }
  return context;
}
