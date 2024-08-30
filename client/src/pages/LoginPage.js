import React, { useContext, useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import { useAuthContext } from "../hooks/useAuthContext";
import {useNavigate} from "react-router-dom"
//testiwqeqw
const LoginPage = () => {
  const [virheViesti, setVirheViesti] = useState("");
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const handleLogin = async (email, password) => {
    setVirheViesti("");
    try {
      const response = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        setError(data.error);
        setVirheViesti("Käyttäjätunnus tai salasana väärä");
        throw new Error(data.error);
      } 
      
      if (response.ok) {
        //save the user to local storage
        localStorage.setItem('user', JSON.stringify(data))
        //update authcontext
        dispatch({type: 'LOGIN', payload: data});
        setIsLoading(false);
        navigate('/')
      } 
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className='Login-container'>
      <LoginForm virheViesti={virheViesti}  isLoading={isLoading} onLogin={handleLogin}></LoginForm>
    </div>
  );
};

export { LoginPage };
