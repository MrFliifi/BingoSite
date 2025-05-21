// File for all the Socket.io Events


// Every  Event has to be in the io.on("connection"), it is the entry point for the Socket.io Server
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected with ID:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });

  })}