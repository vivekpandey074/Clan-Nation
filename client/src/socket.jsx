import React, { useContext, useEffect, useMemo } from "react";
import { createContext } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();
const ENDPOINT = "http://localhost:5000";

// const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(ENDPOINT), []);
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    if (user) {
      socket.emit("setup", user);

      return () => {
        // socket.disconnect();
      };
    }
  }, [user, socket]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
