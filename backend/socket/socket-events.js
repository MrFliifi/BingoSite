// File for all the Socket.io Events
const {fileHandler} = require("../fileHandling/fileHandler.js");


// Every  Event has to be in the io.on("connection"), it is the entry point for the Socket.io Server
module.exports = function (io) {
  io.on("connection", (socket) => {
    // TODO: need to change relative file path
    const handlerInst = new fileHandler("../fileHandling/saveFileLocation", "testFile");
    //handlerInst.createSaveFile();
    console.log("New client connected with ID:", socket.id);


    //When a player presses a Bingofield this socket event receives the data und adds it to the arrays.
    socket.on("ChallengeField", (data) => {
      const { colorIndex, socketId } = data;
      console.log(data);
      
    });
    
    //The Data when a player confirms his/her Color and Name.
    socket.on("playerData", (data) =>{
      const {playerColor, playerName, socketId} =data;
      console.log(data);
      
    });

  /*   //1 sec interval, that gives all player those 3 arrays with the necessary information. EXAMPLE!
    setInterval(() => {

      io.emit("updateBingoField", bingoLobby.colorArr, bingoLobby.challengeArr, bingoLobby.players);
      
    }, 1000);  */
    



    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });

  })}