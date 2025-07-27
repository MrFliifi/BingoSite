import io from "socket.io-client";

// Creates a Socket.io instance for die frontend
export const socket = io("wss://bingo-app-cv3k.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
});


// Add connection event listeners for debugging
socket.on("connect", () => {
  console.log("Connected to WebSocket server with ID:", socket.id); 
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});