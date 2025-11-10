import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { subscribeAuthChanges } from "../firebase/auth";

function GuestRoute({ children }) {
  const [user, setUser] = useState(null);
  const [hasPassword, setHasPassword] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = subscribeAuthChanges((currentUser) => {
      if (!currentUser) {
        setUser(null);
        setHasPassword(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const isGoogle = currentUser.providerData.some(
        (p) => p.providerId === "google.com"
      );

      if (isGoogle) {
        
        const googleHasPassword = currentUser.providerData.some(
          (p) => p.providerId === "password"
        );
        setHasPassword(googleHasPassword);
      } else {
        setHasPassword(true); 
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || (user && hasPassword === null)) return <div className="homepage"><div style={{margin: "0 auto", fontSize:"20px", color:"white"}}>Loading...</div></div>;

  if (!user) return children;

  const isGoogle = user.providerData.some((p) => p.providerId === "google.com");

  if (isGoogle && hasPassword === false) {
    if (location.pathname !== "/set-password") {
      return <Navigate to="/set-password" replace />;
    }
    return children;
  }

  if (!isGoogle && !user.emailVerified) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname !== "/home") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default GuestRoute;
