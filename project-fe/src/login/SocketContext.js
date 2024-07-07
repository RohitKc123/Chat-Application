// SocketContext.js
import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState();
//   useEffect(() => {
//     const socket = io('http://localhost:8000');
//     setSocket(socket);

//   },[]);
  const socket = io('http://localhost:8000');
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
