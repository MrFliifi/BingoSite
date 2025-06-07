// File for all the Socket.io Events

const {lobbyHandler} = require("../lobbyHandling/lobbyHandler.js");
const {playerHandler} = require("../lobbyHandling/playerHandler.js");
const {lobbyHolder} = require("../lobbyHandling/lobbyHolder.js");

// creates lobby instance that tracks state of the game
const listOfLobbies = new lobbyHolder();

// Every  Event has to be in the io.on("connection"), it is the entry point for the Socket.io Server
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected with ID:", socket.id);
    
    //The Data when a player confirms his/her Color and Name.
    socket.on("sendLobbyData", async (data) => {
      const { playerName, lobbyId, gameMode, state, socketId } = data;
      // console.log(playerName, gameMode, state, socketId);
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
        console.log("Player " + player + " created lobby " + lobby);
        // case where player want's to join existing lobby
      } else if (state === "join") {
          // create new player instance
          const player = new playerHandler(socketId, playerName, lobbyId);
          // get all lobbies from lobby holder
          const lobby = listOfLobbies.getLobbies();

          for (let i = 0; i < lobby.length; i++) {
            // check wich lobby player belongs to by comparing lobbyId
            if (lobby[i].getLobbyId() === player.getLobbyId()){
              lobby[i].setPlayer(player);
              console.log("player " + player.getPlayerName() + " joined " + lobby[i].getLobbyId());
            } else {
              console.log("No such Lobby exists");
            }
          }
      }

      /*
      // used to exclude duplicate colors
      const usedColors = lobby.getUsedColor();
      const possibleColors = lobby.getAllPossibleColors();

      // Check if the chosen color is already used
      // if it isn't, it get's used as is
      if (!usedColors.includes(playerColor)) {
        lobby.setUsedColor(playerColor);
      // if it is, find one that isn't
      } else {
        console.log(playerColor + " has already been used.");
        // Find the first available unused color
        for (let i = 0; i < possibleColors.length; i++) {
          // loops through all possibleColors
          const candidateColor = possibleColors[i];
          // checks if it is used already.if it isn't the color get's assined to the player
          if (!usedColors.includes(candidateColor)) {
            playerInst.setColor(candidateColor);
            lobby.setUsedColor(candidateColor);
            console.log("Assigned new color: " + candidateColor);
            break;
          }
        }
      }

      // set player Obj to lobby after changes have been done
      lobby.setPlayer(playerInst);
      */
      /*
      console.log(playerInst.getColor());
      console.log(playerInst.getPlayerName());
      console.log(playerInst.getSocketID());
      */
    });

    //When a player presses a Bingofield this socket event receives the data und adds it to the arrays.
    socket.on("ChallengeField", async (data) => {
      playerInst = lobby.getPlayer();
      const { colorIndex, socketId } = data;
      const playerObj = await lobby.getPlayer(socketId);
      lobby.setBingoColor(colorIndex, playerObj.getColor());
      // loop through each entry and compare for socketID
      console.log(data);
    });
    
    //1 sec interval, that gives all player those 3 arrays with the necessary information. EXAMPLE!
 /*   setInterval(async() => {
        const pickableColor = lobby.getPickableColor();
        const colorArr = await lobby.getBingoColor();
        const players = await lobby.getPlayerNames();
        const bingoChallenges = await lobby.getBingoChallenges();
        
      io.emit("updateBingoField", colorArr, bingoChallenges, players, pickableColor);
      
    }, 1000); 
    */
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);

      // removes color and player from lobby if player dc's
      const player = lobby.getPlayer(socket.id);
      const usedColor = lobby.getUsedColor();
      const users = lobby.getPlayerArr();
      const freeColor = player.getColor();
      const goneUser = player.getPlayerName();
      
      // loop that removes a bunch of stuff from lobby on dc
      for (let i = 0; i < usedColor.length; i++) {
        // remove color
        if (freeColor === usedColor[i]){
          usedColor.splice(i, 1);
          console.log(freeColor + " removed.")
        }
        // remove player
        if (goneUser === users[i].getPlayerName()) {
          console.log("Removed player " + player.getPlayerName());
          users.splice(i, 1);
          break;
        }
      }
    });

  })}

