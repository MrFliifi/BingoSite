// File for all the Socket.io Events

const {lobbyHandler} = require("../lobbyHandling/lobbyHandler.js");
const {playerHandler} = require("../lobbyHandling/playerHandler.js");
const {lobbyHolder} = require("../lobbyHandling/lobbyHolder.js");

// creates lobby instance that tracks state of the game
const listOfLobbies = new lobbyHolder();

// Every  Event has to be in the io.on("connection"), it is the entry point for the Socket.io Server
module.exports = function (io) {

  // 1 sec interval, that gives all clients the neccesary data
  setInterval(async() => {
    // fetch existing lobbies
    const lobby = await listOfLobbies.getLobbies();
    
    // send data to each coressponding lobby
    for (let i = 0; i < lobby.length; i++) {
      const lobbyId = await lobby[i].getLobbyId();
      const pickableColor = await lobby[i].getPickableColor();
      const colorArr = await lobby[i].getBingoColor();
      const players = await lobby[i].getPlayerNames();
      const bingoChallenges = await lobby[i].getBingoChallenges();

      io.to(lobbyId).emit("updateBingoField", colorArr, bingoChallenges, players, pickableColor, lobbyId); 
    }
  }, 2000); 

  io.on("connection", (socket) => {
    console.log("New client connected with ID:", socket.id);
    
    socket.on("sendLobbyData", async (data) => {
      const { playerName, lobbyId, gameMode, state, socketId } = data;
      // case where player creates a lobby
      if (state === "create"){
        // create instance of lobby and player
        const lobby = new lobbyHandler(gameMode, lobbyId, socketId);
        const player = new playerHandler(socketId, playerName, lobbyId);
        // set up the bingo board
        await lobby.setBingoChallenges("testFile");
        // assing player to lobby and lobby to lobby holder
        lobby.setPlayer(player);
        listOfLobbies.setLobbies(lobby);
        socket.join(lobbyId);
        console.log("Player " + player.getPlayerName() + " created lobby: " + lobby.getLobbyId());
        
        // case where player want's to join existing lobby
      } else if (state === "join") {
          // create new player instance
          const player = new playerHandler(socketId, playerName, lobbyId);
          // get all lobbies from lobby holder
          const lobby = await listOfLobbies.getLobbies();

          for (let i = 0; i < lobby.length; i++) {
            // check wich lobby player belongs to by comparing lobbyId
            if (lobby[i].getLobbyId() === player.getLobbyId()){
              lobby[i].setPlayer(player);
              socket.join(lobbyId);
              console.log("Player " + player.getPlayerName() + " joined: " + lobby[i].getLobbyId());
              break;
            } else {
              // needs work
              const message = "No such Lobby exists";
              console.log(message);
              socket.to(socketId).emit("errorMsg", message);
              break;
            }
          }
      }
      
      io.to(socketId).emit("lobbyRouting", {lobbyId, gameMode});
      //console.log(gameMode);
      
    });

    //When a player presses a Bingofield this socket event receives the data und adds it to the arrays.
    socket.on("ChallengeField", async (data) => {
      const { colorIndex, socketId, lobbyId } = data;

      const lobby = await listOfLobbies.getLobbies();
      for (let i = 0; i < lobby.length; i++){
        const id = await lobby[i].getLobbyId();
        
        if (id === lobbyId) {
          const players = await lobby[i].getPlayerArr();

          for (let j = 0; j < players.length; j++) {
            const id = await players[j].getSocketId();
            
            if(id === socketId){
              const color = await players[j].getColor();
              lobby[i].setBingoColor(colorIndex, color);
            }
          }
        }
      }
    });


    socket.on("sendPlayerColor", async (data) => {
      const { playerColor, socketId } = data;
      const lobby = await listOfLobbies.getLobbies();

      for (let i = 0; i < lobby.length; i++) {
        const players = await lobby[i].getPlayerArr();
    
        for (let i = 0; i < players.length; i++) {
          const id = await players[i].getSocketId();

          if (id === socketId){
            players[i].setColor(playerColor);
            console.log("Set Color " + playerColor + " for player " + players[i].getPlayerName());
          }
        }
      }

    });

    socket.on("disconnect", async() => {
      console.log("Client disconnected", socket.id);
      const lobby = await listOfLobbies.getLobbies();

      // removes color and player from lobby if player dc's
      for (let i = 0; i < lobby.length; i++) {
        const players = lobby[i].getPlayerArr();
        let freeColor = "";
        let goneUser = ""

        for (let i = 0; i < players.length; i++) {
          freeColor = players[i].getColor();
          goneUser = players[i].getPlayerName();
        }
        const usedColor = lobby[i].getUsedColor();

        // loop that removes a bunch of stuff from lobby on dc
        // remove color
        for (let i = 0; i < usedColor.length; i++) {
          if (freeColor === usedColor[i]){
            usedColor.splice(i, 1);
            console.log(freeColor + " removed.")
            break;
          }
        }

        // remove player
        for (let i = 0; i < players.length; i++) {
          if (goneUser === players[i].getPlayerName()) {
            console.log("Removed player " + goneUser + " from lobby: " + lobby[i].getLobbyId());
            players.splice(i, 1);
            break;
          }
        }
      }
      socket.leave(socket.id);
    });
  })}

