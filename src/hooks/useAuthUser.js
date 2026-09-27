import { useEffect, useState } from "react";
import { subscribeAuthChanges } from "../firebase/auth";
import { getUserProfile } from "../firebase/db";

/**
 * Current auth user plus their database profile, kept in sync.
 * `loading` is true until the first auth resolution so route guards don't
 * flash the login page for already-signed-in users.
 */
export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = subscribeAuthChanges(async (currentUser) => {
      if (!active) return;

      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(currentUser.uid);
        if (active) setProfile(data);
      } catch {
        if (active) setProfile(null);
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
