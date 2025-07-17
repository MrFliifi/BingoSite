import React, { useEffect, useState } from "react";
import { socket } from "../websocket/socket.js";
import "../styles/noDeath.css";
import "../styles/bingoField.css";
import "../styles/button.css";
import ChallengesModal from "../assets/challengesModal.js";

function NoDeath() {
  const [challengePointMap, setChallengePointMap] = useState(null);
  const [playerObjects, setPlayerObjects] = useState([]);
  const [playerPoints, setPlayerPoints] = useState({});
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

    socket.on("setupNoDeath", (challengePointMap) => {
      setChallengePointMap(new Map(challengePointMap));
    });

    socket.on("updateNoDeath", (data) => {
      const { nameColorArr, pickableColor, lobbyId, gameMode, playerObjects, playerPoints } =
        data;
      setPickableColor(pickableColor);
      setLobbyId(lobbyId);
      setGameMode(gameMode);
      setNameColorArr(nameColorArr);
      setPlayerObjects(playerObjects);
      setPlayerPoints(playerPoints);
    });


    return () => {
      socket.off("errorMsg");
      socket.off("setupNoDeath");
      socket.off("updateNoDeath");
    };
  }, []);

  const toggleCheckmark = (playerId, challengeIndex, currentValue) => {
    const newValue = !currentValue;

    socket.emit("NoDeathCheckmarkUpdate", {
      playerId,
      challengeIndex,
      value: newValue,
      lobbyId,
    });
  };

  const renderChallengesWithCheckmarks = () => {
    if (!challengePointMap) return null;

    return (
      <div className="checkmarkTable">
        {/* Kopfzeile mit Spielernamen */}
        <div className="headerRow">
          <div className="challengeHeader">Challenge</div>
          {nameColorArr.map(({ playerName, playerColor, socketId }) => (
            <div
              key={socketId}
              className="playerHeader"
              style={{
                color: "#fff",
                backgroundColor: playerColor,
              }}
            >
              {playerName}
            </div>
          ))}
        </div>

        {/* Zeilen mit Checkmarks */}
        {Array.from(challengePointMap.entries()).map(
          ([challenge, points], challengeIndex) => (
            <div className="challengeRow" key={challenge}>
              <div className="challengeCell">
                {challenge} ({points} P)
              </div>

              {playerObjects.map(({ playerId, arr }) => {
                const player = nameColorArr.find(
                  (p) => p.socketId === playerId
                );
                const playerColor = player ? player.playerColor : "#ccc";
                const currentValue = arr[challengeIndex];

                return (
                  <div
                    key={playerId}
                    className="checkmarkCell"
                    onClick={() =>
                      toggleCheckmark(playerId, challengeIndex, currentValue)
                    }
                    style={{
                      backgroundColor: currentValue
                        ? playerColor
                        : "transparent",
                      cursor: "pointer",
                    }}
                    title={currentValue ? "Completed" : "Not completed"}
                  >
                    {currentValue ? "✔️" : ""}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    );
  };


  function sendGame() {
    socket.emit("setBingoGameAndLength", challengeGame, "", lobbyId);
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
        <div className="challenges">{renderChallengesWithCheckmarks()}</div>
      </div>
    </div>
  );
}

export default NoDeath;
