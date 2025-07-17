import React, { useEffect, useState } from "react";
import { socket } from "../websocket/socket.js";
import "../styles/bingoField.css";
import "../styles/button.css"
import ChallengesModal from "../assets/challengesModal.js";



function BingoPage() {
 
  // Variables to store the button- and player name, the functions to update them and the color of the player

  // Values Bingofields from the Server
  const [bingoChallenges, setBingoChallenges] = useState(Array(25).fill(""));
  const [bingoFieldColors, setBingoColors] = useState(Array(25).fill(""));

  const [pickableColors, setPickableColors] = useState([]);
  const [lobbyId, setLobbyId] = useState("");
  const [playerColor, setPlayerColor] = useState("");
  const [nameColorArr, setNameColorArr] = useState([]);
  const [gameMode, setGameMode] =useState("");

  //Values and functions for the modal popup window
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  // Values for picking Game and length of the Game
  const [challengeGame, setChallengeGame] = useState("");
  const [challengeLength, setChallengeLength] = useState("");

  useEffect(() => {

    document.title = "ODB Bingo";

    // On Socket-Event "sendBingoField" an Array of 25 strings will be received
    socket.on(
      "updateBingoField",
      (colorArr, bingoChallenges, nameColorArr, pickableColor, lobbyId, gameMode) => {
        console.log(
          "Receiving Bingo Field:",
          colorArr,
        );
        setBingoChallenges(bingoChallenges);
        setBingoColors(colorArr);
        setPickableColors(pickableColor);
        setLobbyId(lobbyId);
        setNameColorArr(nameColorArr);
        setGameMode(gameMode)
      }
    );

    //Socket event for Error Messages from the Server
    socket.on("errorMsg", (message) => {
      alert(message);
    });

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off("updateBingoField");
      socket.off("errorMsg");
    };
  }, []);

  // Function to handle button clicks
  const challengeFieldPressed = (index) => {
    //if no color is picked, do nothing
    if (!playerColor) return;

    const content = bingoChallenges[index];
    console.log(`Button ${index} pressed with Bingo Challenge: "${content}"`);
    //Sending the Server all Data from the Buttonpress
    socket.emit("ChallengeField", { colorIndex: index, socketId: socket.id, lobbyId });

  };

  function sendPlayerColor(color) {
    if (color === "") {
      alert("Pick PlayerColor");
    } else {
      console.log("Send Data:  ");
      console.log(color);

      setPlayerColor(color);
      
    socket.emit("sendPlayerColor",{ playerColor: color, socketId :socket.id, lobbyId  } );
    }
  }

  
  function setBingoGameAndLength() {
    if (challengeGame && challengeLength) {
      socket.emit("setBingoGameAndLength", {
        challengeGame,
        challengeLength,
        lobbyId,
      });
      console.log(
        "on set bingo  game and length " + challengeGame,
        challengeLength,
        lobbyId
      );
    } else {
      alert("Pick Game and Bingolength");
    }
  }

  //Function to determine the color-Gradient in Non-Lockout.
function getBackgroundStyle(colors) {

  // Flatten in case colors is nested (array of arrays)
  colors = colors.flat();

  if (colors.length === 1) return colors[0];

  if (colors.length === 2) {
    return getTwoColorCornerGradient(colors);
  }

  if (colors.length === 3) {
    return getThreeColorPieGradient(colors);
  }

  if (colors.length === 4) {
    return getFourColorCornerGradient(colors);
  }

  // Fallback for more than 4 colors
  return `linear-gradient(to bottom right, ${colors.join(", ")})`;
}
//Functions for each case, when i want to chang only one case without touching the other cases.
function getTwoColorCornerGradient(colors) {
  return `conic-gradient(
    ${colors[0]} 0% 50%,
    ${colors[1]} 50% 100%
  )`;
}
function getThreeColorPieGradient(colors) {

  return `conic-gradient(
    ${colors[0]} 0% 33.33%,
    ${colors[1]} 33.33% 66.66%,
    ${colors[2]} 66.66% 100%
  )`;
}
function getFourColorCornerGradient(colors) {

  return `conic-gradient(
    ${colors[0]} 0% 25%,
    ${colors[1]} 25% 50%,
    ${colors[2]} 50% 75%,
    ${colors[3]} 75% 100%
  )`;
}


  //dynamic rendering of the buttons based on the bingoChallenges array and the bingoColors array
  const renderButtons = () => {
    //Rendering the Buttons for different gameModes
    switch (gameMode?.trim()) {
      case "Lockout":
      case "No-Death":
        return bingoChallenges.map((name, index) => (
          <button
            key={index}
            className="bingoFieldButton"
            onClick={() => challengeFieldPressed(index)}
            style={{ backgroundColor: bingoFieldColors[index] }}
          >
            {name}
          </button>
        ));

      case "Non-Lockout":
        return bingoChallenges.map((name, index) => (
          <button
            key={index}
            className="bingoFieldButton"
            onClick={() => challengeFieldPressed(index)}
            style={{
              background: getBackgroundStyle(bingoFieldColors[index]),
            }}
          >
            {name}
          </button>
        ));

      default:
        console.log(
          "Error, SwitchCase for GameMode didn´t work.... Gamemode Var: ",
          gameMode
        );
    }
  };

  const renderPlayerNames = () => {
    return nameColorArr.map(({ playerName, playerColor }, index) => (
      <div
        className="playerList"
        key={index}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <span style={{ color: "#fff" }}>{playerName}</span>
        <span
          title={playerColor}
          style={{
            backgroundColor: playerColor,
            width: "12px",
            height: "12px",
            display: "inline-block",
            borderRadius: "2px",
            border: "1px solid #000",
          }}
        />
      </div>
    ));
  };

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
            {pickableColors.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

       
        <button className="btn" onClick={() => setShowModal(true)}>
          Select Challenges
        </button>
        <div>GameMode: {gameMode}</div>
        <div>Lobby: {lobbyId}</div>
        <div className="playerListContainer">
          Players: {renderPlayerNames()}
        </div>
      </div>

      <div>
        <ChallengesModal show={showModal} onClose={() => setShowModal(false)}>
          <div className="modalSelectDiv">
            <h2>Challenges Editor</h2>
            <label>Game: </label>
            <select
              className="modalFields"
              id="challengeGame"
              value={challengeGame}
              onChange={(e) => setChallengeGame(e.target.value)}
            >
              <option>-- Choose Game --</option>
              <option value="DarkSouls3">Dark Souls 3</option>
              <option value="EldenRing"> Elden Ring</option>
              <option value="Nightreign"> Nightreign</option>
            </select>
          </div>

          <div className="modalSelectDiv">
            <label>Length: </label>
            <select
              className="modalFields"
              id="challengeLength"
              value={challengeLength}
              onChange={(e) => setChallengeLength(e.target.value)}
            >
              <option>-- Choose Length --</option>
              <option value="short">short</option>
              <option value="medium">medium</option>
              <option value="long">long</option>
            </select>
          </div>

          <div className="modalButtonDiv">
            <button
              className="btn"
              onClick={() => {
                closeModal();
                setBingoGameAndLength();
              }}
            >
              Confirm
            </button>
          </div>
        </ChallengesModal>
      </div>

      <div className="bingoFieldButtonContainer">{renderButtons()}</div>
    </div>
  );
}

export default BingoPage;
