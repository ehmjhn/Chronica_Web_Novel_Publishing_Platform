import { useState } from "react";
import { useToast } from "../components/toast-context";

/**
 * Wraps a mutation so a page can `await run(() => dbCall())` and get loading
 * state plus automatic error toasts, instead of hand-rolling try/catch and
 * alert() in every handler.
 *
 * `run` resolves to `undefined` when it fails, so callers can bail out early
 * on the failure path.
 */
export function useAsyncAction() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function run(fn, { success, onSuccess, onError } = {}) {
    if (busy) return undefined;
    setBusy(true);
    try {
      const result = await fn();
      if (success) toast.success(success);
      onSuccess?.(result);
      return result;
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
      onError?.(err);
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  return { run, busy };
}
