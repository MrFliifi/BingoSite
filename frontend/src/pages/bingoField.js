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

  const [possibleColors, setPossibleColors]= useState([]);
  const [lobbyId, setLobbyId] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [playerColor, setPlayerColor] = useState("");
  const [nameColorArr, setNameColorArr] = useState([]);

  //Values and functions for the modal popup window
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);


// Values for picking Game and length of the Game
  const [challengeGame, setChallengeGame] = useState("");
  const [challengeLength, setChallengeLength] = useState("");

  useEffect(() => {
    // setting currentPlayer from Storage. For Testing maybe won´t need it
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setCurrentPlayer(storedName);
      console.log("You are Player : " ,storedName); 
      
    }

    // On Socket-Event "sendBingoField" an Array of 25 strings will be received
    socket.on(
      "updateBingoField",
      (colorArr, bingoChallenges, nameColorArr, pickableColor, lobbyId) => {
        console.log(
          "Receiving Bingo Field:",
          colorArr,
          bingoChallenges,
          nameColorArr,
          pickableColor,
          lobbyId
        );
        setBingoChallenges(bingoChallenges);
        setBingoColors(colorArr);
        setPossibleColors(pickableColor);
        setLobbyId(lobbyId);
        setNameColorArr(nameColorArr);
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
    if(!playerColor) return;

    const content = bingoChallenges[index];
    console.log(`Button ${index} pressed with Bingo Challenge: "${content}"`);

    //Changing Colors temporary until Server overwrites it.
    const newColors = [...bingoFieldColors];
    newColors[index] = playerColor;
    setBingoColors(newColors);

    //Sending the Server all Data from the Buttonpress
    socket.emit("ChallengeField", { colorIndex: index, socketId : socket.id, lobbyId });
  };

  function sendPlayerColor()
  {
    if(playerColor === "")
    {
      alert("Pick PlayerColor")
    }
    else{
      console.log("Send Data:  " );
      console.log(playerColor);
      
<<<<<<< HEAD
    socket.emit("sendPlayerColor",{playerColor: playerColor, socketId: socket.id, lobbyId: lobbyId,  } );
=======
    socket.emit("sendPlayerColor",{playerColor, socketId :socket.id, lobbyId  } );
>>>>>>> origin/FrontEnd
    }
  }

  function setBingoGameAndLength() {
    if (challengeGame && challengeLength) {
      
      socket.emit("setBingoGameAndLength", {
        challengeGame,
        challengeLength,
        lobbyId
      });
      console.log("on set bingo  game and length " + challengeGame, challengeLength, lobbyId);
    }
  }


  //dynamic rendering of the buttons based on the bingoChallenges array and the bingoColors array
  const renderButtons = () => {
    return bingoChallenges.map((name, index) => (
      <button
        key={index}
        className="bingoFieldButton"
        onClick={() => challengeFieldPressed(index)}
        style={{ backgroundColor: bingoFieldColors[index] || "black" }}
      >
        {name}
      </button>
    ));
  };

  /* //dynamic playerNames and colors rendering based on the nameColor array
  const renderPlayerNames = () => {
    return nameColorArr.map(({ playerName, playerColor }, index) => (
      <div className="playerList" 
      key={index} 
      style={{ color: playerColor }}
      >
        {playerName}
      </div>
    ));
  }; */

  //STILL NEEDS TESTING! Comment above is the old version.
  const renderPlayerNames = () => {
    return nameColorArr.map(({ playerName, playerColor }, index) => (
      <div
        className="playerList"
        key={index}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <span
          style={{ color: "#fff" }}
        >
          {playerName}
        </span>
        <span
          title={playerColor}
          style={{
            backgroundColor: playerColor,
            width: "12px",
            height: "12px",
            display: "inline-block",
            borderRadius: "2px",
            border: "1px solid #000", // Optional: adds border for better visibility
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
            onChange={(e) => setPlayerColor(e.target.value)}
          >
            <option value="">-- Choose color --</option>
            {possibleColors.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <button className="btn" onClick={() => sendPlayerColor()}>
          Confirm Color
        </button>
        <button className="btn" onClick={() => setShowModal(true)}>
          Select Challenges
        </button>
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
              <option value="DS3">Dark Souls 3</option>
              <option value="ED"> EldenRing</option>
              <option value="NR"> NightReign</option>
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
              <option value="short">short</option>
              <option value="normal">normal</option>
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
