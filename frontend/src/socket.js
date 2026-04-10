import { io } from "socket.io-client";


// Create socket connection
const socket = io("http://localhost:8080");

export default socket;