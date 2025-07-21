import React, { useEffect, useState, useRef } from "react";
import { socket } from "../websocket/socket.js";
import "../styles/noDeath.css";
import "../styles/bingoField.css";
import "../styles/button.css";
import ChallengesModal from "../assets/challengesModal.js";

function NoDeath() {
  const [challengePointArray, setChallengePointArray] = useState([]);
  const [playerObjects, setPlayerObjects] = useState([]);
  const [challengeGame, setChallengeGame] = useState("");
  const [nameColorArr, setNameColorArr] = useState([]);
  const [pickableColor, setPickableColor] = useState([]);
  const [gameMode, setGameMode] = useState("");
  const [playerColor, setPlayerColor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [lobbyId, setLobbyId] = useState("");

  const closeModal = () => setShowModal(false);

  useEffect(() => {
    socket.on("errorMsg", (message) => {
      alert(message);
      console.log("Error incoming:", message);
    });

    socket.on("setupNoDeath", (challengePointArray) => {
      setChallengePointArray(challengePointArray);
      console.log(challengePointArray);
      
      
    });

    socket.on(
      "updateNoDeath",
      (nameColorArr, pickableColor, lobbyId, gameMode, playerObjects) => {
        setPickableColor(pickableColor);
        setLobbyId(lobbyId);
        setGameMode(gameMode);
        setNameColorArr(nameColorArr);
        setPlayerObjects(playerObjects);
      }
    );


    return () => {
      socket.off("errorMsg");
      socket.off("setupNoDeath");
      socket.off("updateNoDeath");
    };
  }, []);

  const toggleCheckmark = (playerId, challengeIndex, currentValue) => {
    const newValue = !currentValue;
   
    console.log("emitting CheckmarkUpdate:" , playerId, challengeIndex, newValue);    
    //check if the cell the player wants to press, is his/her own cell
    if(playerId === socket.id)
    {

    socket.emit("NoDeathCheckmarkUpdate", {
      playerId,
      challengeIndex,
      value: newValue,
      lobbyId,
    });
  }
  };

 function renderChallengePlayerHeader() {
   return (
     <div className="headerRow">
       <div className="challengeHeader">Challenges</div>
       {nameColorArr.map(({ playerName, playerColor, playerId }) => {
         // Search for player in the plyerObjects array
         const player = playerObjects.find((p) => p.playerId === playerId);
         const score = player?.playerScore ?? 0;

         return (
           <div
             key={playerId}
             className="playerHeader"
             style={{
               color: "#fff",
               backgroundColor: playerColor,
             }}
           >
             {playerName} ({score})
           </div>
         );
       })}
     </div>
   );
 }


  function renderRows() {
    let globalChallengeIndex = 0;

    return challengePointArray.flatMap(({ category, challenges }) => {
      const rows = [];

      // Kategorie-Zeile
      rows.push(
        <div key={`category-${category}`} className="challengeCategoryRow">
          {category}
        </div>
      );

      // Challenge-Zeilen
      challenges.forEach(({ title, points }, localIndex) => {
        const challengeIndex = globalChallengeIndex;

        rows.push(
          <div className="checkmarkRow" key={`row-${challengeIndex}`}>
            <div className="challengeCell">
              <div className="challengeTitle">{title}</div>
              <div className="challengePoints">({points} P)</div>
            </div>

            {playerObjects.map(({ playerId, checkmarkArray }) => {
              const player = nameColorArr.find((p) => p.playerId === playerId);
              const playerColor = player ? player.playerColor : "#ccc";
              const currentValue = checkmarkArray?.[challengeIndex] ?? false;

              return (
                <div
                  key={`checkmark-${playerId}-${challengeIndex}`}
                  className="checkmarkCell"
                  onClick={() =>
                    toggleCheckmark(playerId, challengeIndex, currentValue)
                  }
                  style={{
                    backgroundColor: currentValue ? playerColor : "transparent",
                    opacity: currentValue ? 0.7 : 1,
                    cursor: "pointer",
                  }}
                  title={currentValue ? "Completed" : "Not completed"}
                >
                  <span style={{ color: currentValue ? "black" : "red" }}>
                    {currentValue ? "\u2713" : "❌"}
                  </span>
                </div>
              );
            })}
          </div>
        );

        globalChallengeIndex++;
      });

      return rows;
    });
  }






  function sendGame() {
    let challengeLength = "";
    socket.emit("setBingoGameAndLength",{challengeGame,challengeLength,lobbyId});
  }

  function sendPlayerColor(color) {
    if (color === "") {
      alert("Pick PlayerColor");
    } else {
      setPlayerColor(color);
      socket.emit("sendPlayerColor", {
        playerColor: color,
        socketId: socket.id,
        lobbyId,
      });
    }
  }

  return (
    <div className="allContainer">
      <div className="header">
        <div className="inputGroup">
          <label>Playercolor: </label>
          <select
            className="fields"
            id="playercolor"
            value={playerColor}
            onChange={(e) => {
              sendPlayerColor(e.target.value);
            }}
          >
            <option value="">-- Choose color --</option>
            {pickableColor.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <button className="btn" onClick={() => setShowModal(true)}>
          Select Game
        </button>
        <div>GameMode: {gameMode}</div>
        <div>Lobby: {lobbyId}</div>
      </div>

      <div>
        <ChallengesModal show={showModal} onClose={closeModal}>
          <div className="modalSelectDiv">
            <h2>No-Death Game</h2>
            <label>Game: </label>
            <select
              className="modalFields"
              id="challengeGame"
              value={challengeGame}
              onChange={(e) => setChallengeGame(e.target.value)}
            >
              <option>-- Choose Game --</option>
              <option value="DarkSouls1">Dark Souls 1</option>
              <option value="DarkSouls2">Dark Souls 2</option>
              <option value="DarkSouls3">Dark Souls 3</option>
            </select>
          </div>

          <div className="modalButtonDiv">
            <button
              className="btn"
              onClick={() => {
                closeModal();
                sendGame();
              }}
            >
              Confirm
            </button>
          </div>
        </ChallengesModal>
      </div>

      <div className="noDeathContainer">
        <div className="challengePlayerHeader">
          {renderChallengePlayerHeader()}
        </div>
        <div className="checkmarkTable">{renderRows()}</div>

        <div className="challengeFooter"></div>
      </div>
    </div>
  );
}


export default NoDeath;
