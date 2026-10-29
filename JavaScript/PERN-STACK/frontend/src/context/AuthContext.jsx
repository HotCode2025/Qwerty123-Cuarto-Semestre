import { createContext, useState } from "react";

export const AuthContext= createContext();

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }
}

export function AuthProvider ({children}) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [errors, setErrors] = useState(null);
    return <AuthContext.Provider value={{
        user,
        isAuth,
        errors,
    }}>
        {children}
    </AuthContext.Provider>
}