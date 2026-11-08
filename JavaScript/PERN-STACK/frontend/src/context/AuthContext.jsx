import { createContext, useState, useContext, useEffect } from "react";
import Cookie from "js-cookie";
import clientes from "../api/axios";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);


  //INGRESAR
  const signin = async(data) => {
    try { 
      const res = await clientes.post("/signin", data);
      setUser(res.data);
      setIsAuth(true);
    return res.data;
      
    } catch (error) {
      console.log(error);
      if(Array.isArray(error.response.data)){
        return setErrors(error.response.data)

    } 
    setErrors([error.response.data.message]);
    }

  };

  //REGISTRARSE
  const signup = async (data) => {
    try {
          const res = await clientes.post("/signup", data);
                  setUser(res.data);
                  setIsAuth(true);
                return res.data;
        
    } catch (error) {

      console.log(error);
      if(Array.isArray(error.response.data)){
        return setErrors(error.response.data)

    } 
    setErrors([error.response.data.message]);
      
    }  
  }; 

  //SALIR
  const signout = async () => {
    await clientes.post("/signout");
    setUser(null);
    setIsAuth(false);
  };

  useEffect(() => {
    if(Cookie.get("token")) {
      clientes.get("/profile", {
      }).then((res) => {
        setUser(res.data);
        setIsAuth(true);
      }).catch((error) => {
        setUser(null);
        setIsAuth(false);
        console.log(error);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        errors,
        signup,
        setUser,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
