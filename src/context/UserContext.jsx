import { createContext, useState, useContext } from "react";
import { login, updateMockUser, getMockUser } from "../services/authServices";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const loginUser = async (credentials) => {
    try {
      const userData = await login(credentials);
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setError(null);
  };

  const updateUser = (newData) => {
    updateMockUser(newData);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, updateUser, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
