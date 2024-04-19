import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/api/users/profile`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        `${baseUrl}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {}
  };

  const setUserContext = (userData) => {
    setUser(userData);
  };

  const removeUserContext = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUserContext, removeUserContext, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
