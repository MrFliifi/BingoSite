// File for all the Socket.io Events
const {fileHandler} = require("../fileHandling/fileHandler.js");

// Every  Event has to be in the io.on("connection"), it is the entry point for the Socket.io Server
module.exports = function (io) {
  io.on("connection", (socket) => {
    // TODO: need to change relative file path
    const handlerInst = new fileHandler("../fileHandling/saveFileLocation", "testFile");
    handlerInst.createSaveFile();
    console.log("New client connected with ID:", socket.id);
    socket.on("buttonPressed", () => {console.log("Button Pressed");});
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });

  })}