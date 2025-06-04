import React, { useEffect, useState } from "react";
import { socket } from "../websocket/socket.js";
import "../styles/bingoField.css";

function BingoPage() {
  // Variables to store the button- and player name, the functions to update them and the color of the player
  const [bingoChallenges, setBingoChallenges] = useState(Array(25).fill(""));
  const [bingoColors, setBingoColors] = useState(Array(25).fill(""));
  const [playerNames, setPlayerNames] = useState([]);
  const [playerColor, setPlayerColor] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState("");

  useEffect(() => {
    // On Socket-Event "sendBingoField" an Array of 25 strings will be received
    socket.on("updateBingoField", (colorArr, challengeArr, players) => {
      console.log("Receiving Bingo Field:", colorArr, challengeArr, players );
      setBingoChallenges(challengeArr);
      setBingoColors(colorArr);
      setPlayerNames(players)
    });
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off("updateBingoField");
    };
  }, []);

  // Function to handle button clicks
  const challengeFieldPressed = (index) => {
    const content = bingoChallenges[index];
    console.log(`Button ${index} pressed with Bingo Challenge: "${content}"`);
    //Changing Colors temporary until Server overwrites it.
    const newColors = [...bingoColors];
    newColors[index] = playerColor;
    setBingoColors(newColors);;
    //Sending the Server all Data from the Buttonpress
    socket.emit("ChallengeField", { colorIndex: index, socketId : socket.id, });
  };

  function sendPlayerData()
  {
    socket.emit("playerData",{playerColor: playerColor, playerName: currentPlayer, socketId: socket.id,  } );
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
    return playerNames.map((name, index) => <div className="playerNames" key={index}>{name}</div>);
  };

  return (
    <div className="allContainer">
      <div className="header">
        <div className="playerNames">
          <label>PlayerName:</label>
          <input
            className="fields"
            type="text"
            id="playerName"
            value={currentPlayer}
            onChange={(e) => setCurrentPlayer(e.target.value)}
          ></input>
          <label>Playercolor: </label>
          <select
            className="fields"
            id="playercolor"
            value={playerColor}
            onChange={(e) => setPlayerColor(e.target.value)}
          >
            <option ></option>
            <option value="red">red</option>
            <option value="blue">blue</option>
            <option value="green">green</option>
            <option value="yellow">yellow</option>
            <option value="purple">purple</option>
            <option value="white">white</option>
          </select>
          <button
            className="submitPlayerButton"
            onClick={() => sendPlayerData()}
          >
            Confirm Name/Color
          </button>
        </div>
        <div className="playerNames">Players: {renderPlayerNames()}</div>
      </div>
      <div className="bingoFieldButtonContainer">{renderButtons()}</div>
    </div>
  );
}

export default BingoPage;
