
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {socket} from "../websocket/socket.js";
import "../styles/homePage.css";

function HomePage() {
const [currentPlayer, setCurrentPlayer] = useState("");
const [gameMode, setGameMode] = useState("");
const [lobbyId, setLobbyId] = useState("");
//Navige for the Routing
const navigate = useNavigate();


useEffect(() => {

   document.title = "Bingo der Bierbank";

  socket.on("errorMsg", (message) => {
    alert(message);
     console.log("Error incoming:", message);
    
    
  });

  //Routing based on the Gamemode

    //This part is kinda tricky. When i send the Server the GameMode it may be "wrong" when the user joins a room.
    //in the Backend i readout the correct gameMode from the lobby but it can´t have the same Name "gameMode", so i had to rename it to "lobbyGameMode"
    //Here i have to destructure it and make lobbyGameMode again to gameMode, so the routing works when someone create or joins a lobby. 
  socket.on("lobbyRouting", (data) => {
  const lobbyId = data.lobbyId;
  const gameMode = data.lobbyGameMode || data.gameMode;


    console.log("Log im Frontend: ", gameMode);
    let route = "";

    switch (gameMode) {
      case "Lockout":
        route = `/Lockout/${lobbyId}`;
        break;
      case "Non-Lockout":
        route = `/Non-Lockout/${lobbyId}`;
        break;
      case "No-Death":
        route = `/No-Death/${lobbyId}`;
        break;
      default:
        alert("Unknown game mode");
        return;
    }

    navigate(route);
  });

  return () => {
    socket.off("errorMsg");
    socket.off("lobbyRouting");
  };
}, [gameMode, navigate]);




    function sendPlayerData(state) {
      
      if (currentPlayer === "") {
        alert("Pick a Name");
      } else if (currentPlayer.length > 15) {
        alert("Playername is longer than 15 characters");
      }
      else if (lobbyId.length > 15)
      {
        alert("LobbyId cannot be longer than 15 characters")
      }
      else if (state === "create" && gameMode === "") {
        alert("Pick a GameMode");
      } 
      else if (!/^[a-zA-Z0-9_]+$/.test(currentPlayer)) {
        alert(
          "Player name may only contain letters, numbers, and underscores."
        );
      } else {
        socket.emit("sendLobbyData", {
          playerName: currentPlayer,
          lobbyId: lobbyId,
          gameMode: gameMode,
          state: state,
          socketId: socket.id,
        }); 
      }
    }



    
  return (
    <div className="allContainer">
      <div className="header">
        <div className="inputGroup">
          <label>PlayerName:</label>
          <input
            className="fields"
            type="text"
            id="playerName"
            value={currentPlayer}
            onChange={(e) => setCurrentPlayer(e.target.value)}
          ></input>
          <label>GameModes:</label>
          <select
            className="fields"
            id="gameModes"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
          >
            <option value="">--Choose GameMode--</option>
            <option value="Lockout">Lockout</option>
            <option value="Non-Lockout">Non-Lockout</option>
            <option value="No-Death">No-Death</option>
          </select>

          <label>LobbyId:</label>
          <input
            className="fields"
            type="text"
            id="LobbyId"
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
          ></input>
        </div>

        <div className="buttonGroup">
          <button
            className="btn"
            onClick={() => sendPlayerData("create")}
            id="createButton"
          >
            Create Lobby
          </button>
          <button
            className="btn"
            onClick={() => sendPlayerData("join")}
            id="joinButton"
          >
            Join Lobby
          </button>
        </div>
      </div>
      <div className="title-container">
        <div className="title">Bingo der Bierbank</div>
      </div>
    </div>
  );
}

export default HomePage;
