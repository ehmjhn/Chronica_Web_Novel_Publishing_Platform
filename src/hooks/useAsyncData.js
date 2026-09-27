import { useEffect, useState } from "react";

/**
 * One-shot async read with teardown. Use this for plain get() calls; for live
 * listeners use useSubscription.
 */
export function useAsyncData(fetcher, deps = [], { initial = null } = {}) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(fetcher)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
