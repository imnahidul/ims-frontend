// import React from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router";


// const Logout = () => {
//    const navigate = useNavigate();
//    const {logout} = useAuth();
//    logout();
//    navigate("/login");

//     // return (
//     //     <div>Logouts</div>
//     // )
// }

// export default Logout;

///////////////4-12-2025 admin logout refresh solve////////////////////////////
import React, { useEffect } from "react"; //  Import useEffect
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();


    useEffect(() => {
        logout(); 
        
        navigate("/login", { replace: true }); 
        
    }, [logout, navigate]); 

    return (
        <p>Logging out...</p>
    );
}

export default Logout;


