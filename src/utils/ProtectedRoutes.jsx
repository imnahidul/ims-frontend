
// import {useEffect} from "react";
// import {useAuth} from "../context/AuthContext";
// import {useNavigate} from "react-router";

// const ProtectedRoutes = ({children, requireRole}) => {
//      const {user} = useAuth();
//      const navigate = useNavigate();

//       useEffect(() => {
//        if(!user) {
//          navigate('/login');
//        }
        
//         if(!requireRole.includes(user.role)) {
//          navigate('/unauthorized');
//          return;
         
//         }

//      },[user, navigate, requireRole] )
       
//        if(!user) return null;
//        if(!requireRole.includes(user.role)) return null;

//      // return user ? children : <Navigate to="/login" />;
     
//      return children;
      

//  }

//   export default ProtectedRoutes;

///////////////4-12-2025 admin logout refresh solve////////////////////////////
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const ProtectedRoutes = ({ children, requireRole }) => {
    // Assuming useAuth now provides a way to know the loading state
    const { user, isLoading } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        // --- 1. HANDLE LOADING STATE (Important for initial page load) ---
        if (isLoading) {
             // Do nothing while loading, wait for 'user' state to be resolved
             return; 
        }

        // --- 2. HANDLE UNAUTHENTICATED STATE (Must be the first check) ---
        if (!user) {
            // CRITICAL: Exit here if user is null/undefined
            navigate('/login', { replace: true });
            return;
        }

        // --- 3. HANDLE UNAUTHORIZED ROLE STATE (SAFE to read user.role here) ---
        // Note: If 'user' exists, but 'requireRole' is defined, check the role
        if (requireRole && !requireRole.includes(user.role)) {
            navigate('/unauthorized', { replace: true });
            return;
        }

    // Include isLoading in dependencies if you add it to the component
    }, [user, navigate, requireRole, isLoading]); 

    
    // --- RENDER BLOCK (For initial load and during loading state) ---
    
    // During load, display a message (or null, which hides content)
    if (isLoading) return null; 
    
    // If the user is null OR unauthorized, we return null to hide content 
    // before the useEffect triggers the navigation.
    if (!user || (requireRole && !requireRole.includes(user.role))) {
        return null;
    }

    // If authorized, render the children
    return children;
}

export default ProtectedRoutes;