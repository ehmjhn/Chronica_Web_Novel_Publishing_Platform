import { useEffect, useState } from "react"
import { subscribeAuthChanges } from "../firebase/auth";
import { Navigate } from "react-router";

function GuestRoute ({children}){
    const [user, setUser] = useState(undefined);
    const [loading, isLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = subscribeAuthChanges((currentUser) => {
            setUser(currentUser);
            isLoading(false);
        });

        return ()=> unsubscribe();
    },[])

    if (loading) return <p>Loading...</p>;

    if (user) return <Navigate to='/home' replace/>; //ginagamit si replace para d makabalik sa prev activity/page

    return children;
}

export default GuestRoute