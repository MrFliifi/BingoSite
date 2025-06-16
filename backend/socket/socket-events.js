// File for all the Socket.io Events

const { lobbyHandler } = require("../lobbyHandling/lobbyHandler.js");
const { playerHandler } = require("../lobbyHandling/playerHandler.js");
const { lobbyHolder } = require("../lobbyHandling/lobbyHolder.js");
const { fileHandler } = require("../fileHandling/fileHandler.js");

// creates lobby instance that tracks state of the game
const listOfLobbies = new lobbyHolder();

// Every  Event has to be in the io.on("connection"), it is the entry point for the Socket.io Server
module.exports = function (io) {
  // 1 sec interval, that gives all clients the neccesary data
  setInterval(async () => {
    // fetch existing lobbies
    const lobby = await listOfLobbies.getLobbies();
    console.log("Periodic lobby Log: ");

    console.log(lobby);

    // send data to each coressponding lobby
    for (let i = 0; i < lobby.length; i++) {
      const lobbyId = await lobby[i].getLobbyId();
      const pickableColor = await lobby[i].getPickableColor();
      const colorArr = await lobby[i].getBingoColor();
      const players = await lobby[i].getPlayerNames();
      const bingoChallenges = await lobby[i].getBingoChallenges();

      io.to(lobbyId).emit(
        "updateBingoField",
        colorArr,
        bingoChallenges,
        players,
        pickableColor,
        lobbyId
      );
    }

    //1000 equals 1 second. Right now 2 secs.
  }, 2000);

  // logic to remove empty lobbys every 20 secs.
  setInterval(async () => {
    console.log("Deleting empty Lobbys....");

    const lobbies = await listOfLobbies.getLobbies();
    for (let i = 0; i < lobbies.length; i++) {
      const players = await lobbies[i].getPlayerArr();

      if (players.length === 0) {
        console.log(
          "Players in the lobby that is about to get wiped (Should be empty) "
        );
        console.log(players);
        console.log("Deleted Lobby :" + lobbies[i]);
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

      // case where player creates a lobby
      if (state === "create") {
        // create instance of lobby and player
        const lobby = new lobbyHandler(gameMode, lobbyId, socketId);
        const player = new playerHandler(socketId, playerName, lobbyId);
        // set up the bingo board
        await lobby.setBingoChallenges("testFile");
        // assing player to lobby and lobby to lobby holder
        lobby.setPlayer(player);
        listOfLobbies.setLobbies(lobby);
        socket.join(lobbyId);
        console.log(
          "Player " +
            player.getPlayerName() +
            " created lobby: " +
            lobby.getLobbyId()
        );
        io.to(socketId).emit("lobbyRouting", { lobbyId, gameMode });

        // case where player want's to join existing lobby
      } else if (state === "join") {
        // get all lobbies from lobby holder
        const lobby = await listOfLobbies.getLobbies();

        // setting false, so that i can set to true, if there was already a lobby
        let lobbyFound = false;

        for (let i = 0; i < lobby.length; i++) {
          // check wich lobby player belongs to by comparing lobbyId
          if (lobby[i].getLobbyId() === lobbyId) {
            // create new player instance, when a lobby is found
            const player = new playerHandler(socketId, playerName, lobbyId);
            lobby[i].setPlayer(player);
            socket.join(lobbyId);
            console.log(
              "Player " +
                player.getPlayerName() +
                " joined: " +
                lobby[i].getLobbyId()
            );
            //Send the Routing information, when player was assigned to a lobby
            io.to(socketId).emit("lobbyRouting", { lobbyId, gameMode });
            lobbyFound = true;
            break;
          }
        }
        //If no Lobby was found, send error Message
        if (!lobbyFound) {
          console.log("sending player errorMsg");
          io.to(socketId).emit("errorMsg", "Lobby doesn’t exist");
        }
      }
    });

    // request from the FrontEnd to send the Challenges from the ChallengeFile NEEDS TESTING!
    socket.on("requestChallenges", async (data) => {
      const socketId = data;

      const fileHandlerInst = new fileHandler(
        "../fileHandling/saveFileLocation",
        "testFile"
      );
      // fill array with data from file
      let contentArr = await fileHandlerInst.readFromSaveFile();
      console.log("ChallengesArr fürs Frontend: ");

      console.log(contentArr);

      io.to(socketId).emit("updateChallengeEditor", contentArr);
    });

    socket.on("deleteChallenges", async (data) => {
      const { deletedChallenges, filePath, fileName } = data;
      const fileHandlerInst = new fileHandler(filePath, fileName);
      for (let i = 0; i < deletedChallenges.length; i++) {
        await fileHandlerInst.deleteFromSafeFile(deletedChallenges[i]);
      }
      fileHandler.close();
    });

    socket.on("addChallenge", async (data) => {
      const { addedChallenge, filePath, fileName } = data;
      const fileHandlerInst = new fileHandler(filePath, fileName);
      await fileHandlerInst.writeToSaveFile(addedChallenge);
      fileHandlerInst.close();
      console.log(addedChallenge);
    });

    //When a player presses a Bingofield this socket event receives the data und adds it to the arrays.
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
              lobby[i].setBingoColor(colorIndex, color);
            }
          }
        }
      }
    });

    // PlayerColor from the Frontend Bingopage
    socket.on("sendPlayerColor", async (data) => {
      const { playerColor, socketId } = data;
      const lobby = await listOfLobbies.getLobbies();

      for (let i = 0; i < lobby.length; i++) {
        const players = await lobby[i].getPlayerArr();

        for (let j = 0; j < players.length; j++) {
          const id = await players[j].getSocketId();

          if (id === socketId) {
            players[j].setColor(playerColor);
            lobby[i].setUsedColor(playerColor);
            console.log(
              "Set Color " +
                playerColor +
                " for player " +
                players[j].getPlayerName()
            );
          }
        }
      }
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected", socket.id);
      const lobby = await listOfLobbies.getLobbies();

      // removes color and player from lobby if player dc's
      for (let i = 0; i < lobby.length; i++) {
        const players = lobby[i].getPlayerArr();
        let freeColor = "";
        let goneUser = "";

        for (let j = 0; j < players.length; j++) {
          freeColor = players[j].getColor();
          goneUser = players[j].getPlayerName();
        }
        const usedColor = lobby[i].getUsedColor();

        // loop that removes a bunch of stuff from lobby on dc
        // remove color
        for (let k = 0; k < usedColor.length; k++) {
          if (freeColor === usedColor[k]) {
            usedColor.splice(k, 1);
            console.log(freeColor + " removed.");
            break;
          }
        }

        // remove player
        for (let h = 0; h < players.length; h++) {
          if (goneUser === players[h].getPlayerName()) {
            console.log(
              "Removed player " +
                goneUser +
                " from lobby: " +
                lobby[i].getLobbyId()
            );
            players.splice(h, 1);
            break;
          }
        }
      }
      socket.leave(socket.id);
    });
  });
};
