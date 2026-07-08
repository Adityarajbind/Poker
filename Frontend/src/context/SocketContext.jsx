import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

const socket = io("http://localhost:5000", {
  autoConnect: false,
});

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}