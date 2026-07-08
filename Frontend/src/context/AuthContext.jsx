import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) return;

    const user = JSON.parse(storedUser);

    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    setUserId(user._id);
    setUsername(user.username);
    setEmail(user.email);
    setToken(token);

    return () => {
      socket.disconnect();
    };
  }, []);
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);

    if (!socket.connected) {
      socket.auth = {
        token: userData.token,
      };

      socket.connect();
    }

    setUserId(userData._id);
    setUsername(userData.username);
    setEmail(userData.email);
    setToken(userData.token);
  };
  const logout = () => {
    socket.disconnect();
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUserId(null);
    setUsername("");
    setEmail("");
    setToken("");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        email,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
