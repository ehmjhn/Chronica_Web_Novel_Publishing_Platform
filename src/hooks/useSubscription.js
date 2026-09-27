import { useEffect, useRef, useState } from "react";

/**
 * Subscribes to a realtime source and guarantees teardown.
 *
 * `subscribe` receives a setter-like callback and must return an unsubscribe
 * function. This removes the ~40 listener leaks that accumulated across the app.
 */
export function useSubscription(subscribe, deps = [], { enabled = true, initial = null } = {}) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const subscribeRef = useRef(subscribe);
  subscribeRef.current = subscribe;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError(null);

    let unsubscribe = () => {};
    try {
      unsubscribe =
        subscribeRef.current((value) => {
          if (!active) return;
          setData(value);
          setLoading(false);
        }) || (() => {});
    } catch (err) {
      if (active) {
        setError(err);
        setLoading(false);
      }
    }

    return () => {
      active = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, loading, error };
}
