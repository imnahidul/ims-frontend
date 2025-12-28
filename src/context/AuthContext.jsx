// import { createContext, useState, useContext } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({children}) => {
//     const[user,setUser] =useState(() => {

//         const storeUser = localStorage.getItem("pos-user");
//         return storeUser ? JSON.parse(storeUser):null;
//     })
//     const login =(userData, token) =>{
//         setUser(userData);
//         localStorage.setItem("pos-user", JSON.stringify(userData));
//         localStorage.setItem("pos-token",token);
//     }

//     const logout =() =>{
//         setUser(null);
//         localStorage.removeItem("pos-user");
//         localStorage.removeItem("pos-token");
//     }
//     return(
//         <AuthContext.Provider value={{user, login,logout}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }
// export const useAuth = () =>useContext(AuthContext);


// export default AuthProvider;


///////////////4-12-2025 admin logout refresh solve////////////////////////////

import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    
    const [user, setUser] = useState(null);
    
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        try {
            const storeUser = localStorage.getItem("pos-user");
            if (storeUser) {
                setUser(JSON.parse(storeUser));
            }
        } catch (error) {
            console.error("Error reading pos-user from localStorage:", error);
            // Handle corrupted localStorage data by logging out
            localStorage.removeItem("pos-user");
            localStorage.removeItem("pos-token");
        } finally {
            // Once the check is done (success or failure), set loading to false
            setIsLoading(false); 
        }
    }, []); // Empty dependency array ensures it runs only on mount


    const login = (userData, token) => {
        setUser(userData);
        // localStorage is synchronous, so no need for await
        localStorage.setItem("pos-user", JSON.stringify(userData));
        localStorage.setItem("pos-token", token);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("pos-user");
        localStorage.removeItem("pos-token");
    }
    
    // 4. NEW: Include isLoading in the context value
    return(
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;