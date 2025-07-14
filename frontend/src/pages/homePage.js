
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
  socket.on("errorMsg", (message) => {
    alert(message);
     console.log("Error incoming:", message);
    
    
  });

  //Routing based on the Gamemode
  socket.on("lobbyRouting", (data) => {
    const { lobbyId, gameMode } = data;

    let route = "";

    switch (gameMode) {
      case "Lockout":
        route = `/Lockout/${lobbyId}`;
        break;
      case "Non-Lockout":
        route = `/Non-Lockout/${lobbyId}`;
        break;
      case "TimeTrial":
        route = `/TimeTrial/${lobbyId}`;
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
      else if (gameMode === "") {
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

        // Save the Name
        localStorage.setItem("gameMode", gameMode);
       
       
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
            <option value="TimeTrial"> Time-Trial</option>
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
        <div className="title">Orden der Bierbank Bingo</div>
      </div>
      <div className="linkChallengeContainer">
        <Link className="linkChallenge" to="/challengeEditor">
          ChallengeEditor
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
