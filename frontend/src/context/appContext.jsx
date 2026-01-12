import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextprovider = ({ children }) => {
  // 🔐 Always send cookies
  axios.defaults.withCredentials = true;

  // Gateway URL - distributed system entry point
  const backendUrl = 'http://localhost:3000';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check authentication state
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/me`);

      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.user); // comes from JWT
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Optional: refresh user profile from DB
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`);
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load user data");
    }
  };

  // 🚀 Run once on app load
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
};
