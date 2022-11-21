import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
