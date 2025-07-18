// File for all the Socket.io Events

const { lobbyHandler } = require("../lobbyHandling/lobbyHandler.js");
const { playerHandler } = require("../lobbyHandling/playerHandler.js");
const { lobbyHolder } = require("../lobbyHandling/lobbyHolder.js");
const { fileHandler } = require("../fileHandling/fileHandler.js");

// Creates lobbyHolder instance that manages all existing lobbies
const listOfLobbies = new lobbyHolder();

// Every Event has to be in the io.on("connection"), it is the entry point for the Socket.io Server
module.exports = function (io) {
  // 1 sec interval, that gives all clients the neccesary data
  setInterval(async () => {
    // Fetch existing lobbies
    const lobbies = await listOfLobbies.getLobbies();
    console.log("Periodic lobby Log: ", lobbies);

    // Send data to each coressponding lobby
    for (let i = 0; i < lobbies.length; i++) {
      const pickableColor = await lobbies[i].getPickableColor();
      const colorArr = await lobbies[i].getBingoColor();
      const gameMode = await lobbies[i].getGameMode();
      const lobbyId = await lobbies[i].getLobbyId();
      // We need to fetch a dict of name and color for each member of the lobby and write that to an arr (nameColorArr)
      // We send this arr to the website 
      // Get all players from lobby
      const playerArr = await lobbies[i].getPlayerArr();
      let nameColorArr = [];
      for (let j = 0; j < playerArr.length; j++) {
        // for each player, get the dict
        nameColorArr[j] = await playerArr[j].getNameColorPair();
      }
      let playerObjects = [];
      if (gameMode ===  "No-Death") {
        for (let k = 0; k < playerArr.length; k++) {
          const player = {
            playerId: await playerArr[k].getSocketId(),
            playerScore: await playerArr[k].getScore(),
            checkmarkArray: []
          }
          playerObjects.push(player);
        }
      }
      
      // ToDo: these two don't need to be send every second. Once is enough. Create a new Event for them
      
      const bingoChallenges = await lobbies[i].getBingoChallenges();
      if (gameMode === "No-Death") {
        io.to(lobbyId).emit(
          "updateNoDeath", 
          nameColorArr, 
          pickableColor, 
          lobbyId, 
          gameMode, 
          playerObjects
        )
      } else {
        io.to(lobbyId).emit(
          "updateBingoField",
          colorArr,
          bingoChallenges,
          nameColorArr,
          pickableColor,
          lobbyId,
          gameMode
        );
      }
    }

    //1000 equals 1 second. Right now 2 secs.
  }, 2000);

  // Logic to remove empty lobbys every 20 secs.
  setInterval(async () => {
    console.log("Deleting empty Lobbys....");

    const lobbies = await listOfLobbies.getLobbies();
    for (let i = 0; i < lobbies.length; i++) {
      const players = await lobbies[i].getPlayerArr();

      if (players.length === 0) {
        console.log("0 Players in the lobby that is about to get wiped.");
        console.log("Deleted Lobby: " + await lobbies[i].getLobbyId());
        listOfLobbies.deleteLobby(i);
      }
    }
  }, 20000);

  io.on("connection", (socket) => {
    console.log("New client connected with ID:", socket.id);

    // Data from Frontend when a Player creates or joins a lobby
    socket.on("sendLobbyData", async (data) => {
      const { playerName, lobbyId, gameMode, state, socketId } = data;
      console.log("received Data: " + data);
    
      // Case where player creates a lobby
      if (state === "create") {
        const lobbies = await listOfLobbies.getLobbies();

        if (lobbies.length == 0) {
          const lobby = new lobbyHandler(gameMode, lobbyId);
          const player = new playerHandler(socketId, playerName, lobbyId);

          // Assing player to lobby and lobby to lobby holder
          await lobby.setPlayer(player);
          await listOfLobbies.setLobbies(lobby);
          socket.join(lobbyId);
          console.log("Player " + await player.getPlayerName() + " created lobby: " + await lobby.getLobbyId());
          io.to(socketId).emit("lobbyRouting", { lobbyId, gameMode });

        } else {
          // Check if lobby already exists
          let lobbyExists = false;
          for (let i = 0; i < lobbies.length; i++) {
            const existingLobbyId = await lobbies[i].getLobbyId();
            if (existingLobbyId === lobbyId) {
              lobbyExists = true;
              break;
            }
          }

          if (lobbyExists == false) {
              // Create instance of lobby and player
              const lobby = new lobbyHandler(gameMode, lobbyId);
              const player = new playerHandler(socketId, playerName, lobbyId);
              
              // Assign player to lobby and lobby to lobby holder
              await lobby.setPlayer(player);
              await listOfLobbies.setLobbies(lobby);
              socket.join(lobbyId);
              console.log("Player " + await player.getPlayerName() + " created lobby: " + await lobby.getLobbyId());
              io.to(socketId).emit("lobbyRouting", { lobbyId, gameMode });
          } else {
              io.to(socketId).emit("errorMsg", "Lobby already exists");
          }
        }
      // Case where player want's to join existing lobby
      } else if (state === "join") {
        // get all lobbies from lobby holder
        const lobbies = await listOfLobbies.getLobbies();

        // Setting false, so that i can set to true, if there was already a lobby
        let lobbyFound = false;

        for (let i = 0; i < lobbies.length; i++) {
          // Check wich lobby player belongs to by comparing lobbyId
          const id = await lobbies[i].getLobbyId();
          if (id === lobbyId) {
            // Create new player instance, when a lobby is found
            const player = new playerHandler(socketId, playerName, lobbyId);
            await lobbies[i].setPlayer(player);
            /* ToDo: Gamemode is unneccesary here when joining. But socket event 
            needs that var to be send over. Would need to create a new 
            SocketEvent in order to remove this line*/ 
            let lobbyGameMode = await lobbies[i].getGameMode();
            
            socket.join(lobbyId);
            console.log("Player " + player.getPlayerName() + " joined: " + id);
            // Send the Routing information, when player was assigned to a lobby
            io.to(socketId).emit("lobbyRouting", { lobbyId, lobbyGameMode });
            lobbyFound = true;
            break;
          }
        }
        // If no Lobby was found, send error Message
        if (!lobbyFound) {
          console.log("sending player errorMsg");
          io.to(socketId).emit("errorMsg", "Lobby doesn’t exist");
        }
      }
    });

    // Event that allows user to pick a safefile and the length of the challenge
    socket.on("setBingoGameAndLength", async (data) => {
      // probably need to send a default value for challengeLength
      const { challengeGame, challengeLength, lobbyId } = data;

      const lobbies = await listOfLobbies.getLobbies();
      for (let i = 0; i < lobbies.length; i++) {
        const id = await lobbies[i].getLobbyId();
        if(id === lobbyId) {
          const gameMode = await lobbies[i].getGameMode();
          // needs testing
          if (gameMode === "No-Death") {
            console.log(challengePointMap);
            const challengePointMap = await fileHandler.readFromNdSaveFile(gameMode);
            socket.emit("setupNoDeath", challengePointMap);
            break;
          } else {
            console.log("bin hier, wer noch?")
            await lobbies[i].setBingoChallenges(challengeGame, "./saveFileLocation/", challengeLength, gameMode);
            console.log("Set game to " + challengeGame + " and length " + challengeLength);
            break;
          }
        }
      }
    });
    
    // When a player presses a Bingofield this socket event receives the data und adds it to the arrays.
    socket.on("ChallengeField", async (data) => {
      const { colorIndex, socketId, lobbyId } = data;

      const lobby = await listOfLobbies.getLobbies();
      for (let i = 0; i < lobby.length; i++) {
        const id = await lobby[i].getLobbyId();
        if (id === lobbyId) {
          const players = await lobby[i].getPlayerArr();

          for (let j = 0; j < players.length; j++) {
            const id = await players[j].getSocketId();
            if (id === socketId) {
              const color = await players[j].getColor();
              await lobby[i].setBingoColor(colorIndex, color);
              console.log("Field at index " + colorIndex + " set to color " + color);
              break;
            }
          }
          break;
        }
      }
    });

    // sets PlayerColor with data from the Frontend Bingopage
    socket.on("sendPlayerColor", async (data) => {
      const { playerColor, socketId, lobbyId } = data;
      const lobbies = await listOfLobbies.getLobbies();

      // Find the correct lobby by lobbyId
      for (let i = 0; i < lobbies.length; i++) {
        const id = await lobbies[i].getLobbyId();
        if (lobbyId === id) {
          const players = await lobbies[i].getPlayerArr();

          // Find the correct player by socketId
          for (let j = 0; j < players.length; j++) {
            const playerSocketId = await players[j].getSocketId();
            if (playerSocketId === socketId) {
              const currentPlayerColor = await players[j].getColor();

              // If player already had a color, remove it
              if (currentPlayerColor !== "") {
                await lobbies[i].removeUsedColor(currentPlayerColor);
                const name = await players[j].getPlayerName();
                console.log(`The player ${name} changed their color from ${currentPlayerColor} to ${playerColor}`);
              }

              // Refresh used colors after removing the previous one
              const usedColor = await lobbies[i].getUsedColor();
                            
              if (!usedColor.includes(playerColor)) {
                await players[j].setColor(playerColor);
                await lobbies[i].setUsedColor(playerColor);
                const name = await players[j].getPlayerName();
                console.log(`Set Color ${playerColor} for player ${name}`);
              } else {
                // Assign next available color
                const color = await lobbies[i].getPickableColor();
                await players[j].setColor(color[0]);  // Assuming setColor is correct
                await lobbies[i].setUsedColor(color[0]);
                const name = await players[j].getPlayerName();
                console.log(`Set Color ${color[0]} for player ${name}`);
              }
              break; // Done with this player
            }
          }
          break; // Done with this lobby
        }
      }
    });

    // Handles the player disconnecting from the lobby
    socket.on("disconnect", async () => {
      console.log("Client disconnected", socket.id);
      const lobby = await listOfLobbies.getLobbies();

      // Removes color and player from lobby if player dc's
      for (let i = 0; i < lobby.length; i++) {
        const players = await lobby[i].getPlayerArr();
        let freeColor = "";
        let goneUser = "";

        for (let j = 0; j < players.length; j++) {
          freeColor = await players[j].getColor();
          goneUser = await players[j].getPlayerName();
        }
        const usedColor = await lobby[i].getUsedColor();

        // Loop that removes a bunch of stuff from lobby on dc
        // Remove color
        for (let k = 0; k < usedColor.length; k++) {
          if (freeColor === usedColor[k]) {
            usedColor.splice(k, 1);
            console.log(freeColor + " removed.");
            break;
          }
        }

        // remove player
        for (let h = 0; h < players.length; h++) {
          if (goneUser === await players[h].getPlayerName()) {
            console.log("Removed player " + goneUser + " from lobby: " + await lobby[i].getLobbyId());
            players.splice(h, 1);
            break;
          }
        }
      }
      socket.leave(socket.id);
    });
  });
};

/*
    // ToDo: Figure out if this is still usefull?
    // event that assings safefile to lobby
    socket.on("loadSaveFile", async (data) => {
      const { fileName, fileDir, lobbyId } = data;
      console.log("received Data: " + data);
      
      const lobbies = await listOfLobbies.getLobbies();
      for (let i = 0; i < lobbies.length; i++) {
        const id = await lobbies[i].getLobbyId();
        if(id === lobbyId) {
          // set file location
          await lobbies[i].setFileName(fileName);
          await lobbies[i].setFileDir(fileDir);
          // replace default value with values from file
          await lobbies[i].setBingoChallenges(fileName, fileDir);
          break;
        }
      }
    });

    // request from the FrontEnd to send the Challenges from the ChallengeFile NEEDS TESTING!
    socket.on("requestChallenges", async (data) => {
      const socketId = data;

      const fileHandlerInst = new fileHandler("../fileHandling/saveFileLocation", "testFile");
      // fill array with data from file
      let contentArr = await fileHandlerInst.readFromSaveFile();
      console.log("ChallengesArr fürs Frontend: ");

      console.log(contentArr);

      io.to(socketId).emit("updateChallengeEditor", contentArr);
    });

    socket.on("deleteChallenges", async (data) => {
      const { deletedChallenges, lobbyId } = data;

      let fileName = "";
      let fileDir = "";

      const lobbies = await listOfLobbies.getLobbies();
      for (let i = 0; i < lobbies.length; i++) {
        const id = await lobbies[i].getLobbyId();
        if (id === lobbyId){
          // fetch components of file path from lobby
          fileName = await lobbies[i].getFileName();
          fileDir = await lobbies[i].getFileDir();
          break;
        }
      }
      // use filepath to create filehanderinstance. is used to delete challenges
      const fileHandlerInst = new fileHandler(filePath, fileName);
      for (let j = 0; j < deletedChallenges.length; j++) {
        await fileHandlerInst.deleteFromSafeFile(deletedChallenges[i]);
      }
      fileHandlerInst.close();
    });

    socket.on("addChallenge", async (data) => {
      const { addedChallenge, lobbyId } = data;

      let fileName = "";
      let fileDir = "";

      const lobbies = await listOfLobbies.getLobbies();
      for (let i = 0; i < lobbies.length; i++) {
        const id = await lobbies[i].getLobbyId();
        if (id === lobbyId){
          // fetch components of file path from lobby
          fileName = await lobbies[i].getFileName();
          fileDir = await lobbies[i].getFileDir();
          break;
        }
      }
      const fileHandlerInst = new fileHandler(fileDir, fileName);
      await fileHandlerInst.writeToSaveFile(addedChallenge);
      fileHandlerInst.close();
      console.log(addedChallenge);
    });
    */
