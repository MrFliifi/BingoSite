
import { Link, useNavigate } from "react-router";
import "../styles/homePage.css";
import { useState, useEffect } from "react";
import {socket} from "../websocket/socket.js";

function HomePage() {
const [currentPlayer, setCurrentPlayer] = useState("");
const [gameMode, setGameMode] = useState("");
const [lobbyId, setLobbyId] = useState("");
//Navige for the Routing
const navigate = useNavigate();


useEffect(() => {
  socket.on("errorMsg", (message) => {
    alert(message);
  });

  //Routing based on the Gamemode NEEDS TESTING!!!!
  socket.on("lobbyRouting", (lobbyId,gameMode) => {
    if (!gameMode || !lobbyId) return;
    let route = "";

    switch (gameMode) {
      case "Lockout":
        route = `/bingoLockout/${lobbyId}`;
        break;
      case "Non-Lockout":
        route = `/bingoNonLockout/${lobbyId}`;
        break;
      case "TimeTrial":
        route = `/bingoTimeTrial/${lobbyId}`;
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
      else
      {
        socket.emit("sendPlayerData", {playerName:currentPlayer, gameMode: gameMode, state: state, socketId: socket.id })
        console.log(currentPlayer, gameMode, state, socket.id);
        
      }

      
     
    }

    
  return (
    <div className="allContainer">
      <div className="header">
        <div>
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
        <button
          className="lobbyButton"
          onClick={() => sendPlayerData("create")}
          id="createButton"
        >
          Create Lobby
        </button>
        <button
          className="lobbyButton"
          onClick={() => sendPlayerData("join")}
          id="joinButton"
        >
          Join Lobby
        </button>
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
