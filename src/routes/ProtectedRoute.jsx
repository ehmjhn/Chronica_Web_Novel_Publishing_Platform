import { useEffect, useState } from "react"
import { subscribeAuthChanges } from "../firebase/auth";
import { Navigate } from "react-router";

function ProtectedRoute ({children}){
    const [user, setUser] = useState(undefined);
    const [loading, isLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = subscribeAuthChanges((currentUser) => {
            setUser(currentUser);
            isLoading(false);
        });

        return ()=> unsubscribe();
    },[])

    if (loading) return <div className="homepage"><div style={{margin: "0 auto", fontSize:"20px", color:"white"}}>Loading...</div></div>;

    if (!user) return <Navigate to='/login' replace/>; //ginagamit si replace para d makabalik sa prev activity/page

    return children;
}

export default ProtectedRoute