import React, { useEffect, useState } from "react";
import { socket } from "../websocket/socket.js";
import "../styles/bingoField.css";

function BingoPage() {
  // Variables to store the button- and player name, the functions to update them and the color of the player
  const [bingoChallenges, setBingoChallenges] = useState(Array(25).fill(""));
  const [bingoColors, setBingoColors] = useState(Array(25).fill(""));
  const [playerNames, setPlayerNames] = useState([]);
  const [playerColor, setPlayerColor] = useState("");
  const [possibleColors, setPossibleColors]= useState([]);
  const [lobbyId, setLobbyId] = useState("");

  useEffect(() => {
    // On Socket-Event "sendBingoField" an Array of 25 strings will be received
    socket.on("updateBingoField", (bingoColorArr, challengeArr, players, possibleColors, lobbyId) => {
      console.log(
        "Receiving Bingo Field:",
        bingoColorArr,
        challengeArr,
        players,
        possibleColors
      );
      setBingoChallenges(challengeArr);
      setBingoColors(bingoColorArr);
      setPlayerNames(players)
      setPossibleColors(possibleColors);
      setLobbyId(lobbyId);
    });

    
//Socket event for Error Messages from the SErver
    socket.on("errorMsg", (message) => {

      alert(message)
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
    const newColors = [...bingoColors];
    newColors[index] = playerColor;
    setBingoColors(newColors);

    //Sending the Server all Data from the Buttonpress
    socket.emit("ChallengeField", { colorIndex: index, socketId : socket.id, lobbyId: lobbyId });
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
      
    socket.emit("sendPlayerColor",{playerColor: playerColor, socketId: socket.id,  } );
    }
  }


  //dynamic rendering of the buttons based on the bingoChallenges array and the bingoColors array
  const renderButtons = () => {
    return bingoChallenges.map((name, index) => (
      <button
        key={index}
        className="bingoFieldButton"
        onClick={() => challengeFieldPressed(index)}
        style={{ backgroundColor: bingoColors[index] || "black" }}
      >
        {name}
      </button>
    ));
  };

  //dynamic playerNames rendering based on the playerNames array
  const renderPlayerNames = () => {
    return playerNames.map((name, index) => <div className="playerList" key={index}>{name}</div>);
  };

  return (
    <div className="allContainer">
      <div className="header">
        <div className="headerContainer">
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

          <button
            className="submitColorButton"
            onClick={() => sendPlayerColor()}
          >
            Confirm Color
          </button>
        </div>
        <div className = "playerListContainer">Players: {renderPlayerNames()}</div>
      </div>
      <div className="bingoFieldButtonContainer">{renderButtons()}</div>
    </div>
  );
}

export default BingoPage;
