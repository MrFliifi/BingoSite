import React, { useEffect, useState } from "react";
import { socket } from "../websocket/socket.js";
import "../styles/bingoField.css";

function BingoPage() {
  // Variables to store the button- and player name, the functions to update them and the color of the player
  const [bingoChallenges, setBingoChallenges] = useState(Array(25).fill(""));
  const [bingoColors, setBingoColors] = useState(Array(25).fill(""));
  const [playerNames, setPlayerNames] = useState([]);
  const [playerColor, setPlayercolor] = useState("");

  useEffect(() => {
    // On Socket-Event "sendBingoField" an Array of 25 strings will be received
    socket.on("updateBingoField", (data) => {
      console.log("Receiving Bingo Field:", data);
      setBingoChallenges(data.challenges);
      setBingoColors(data.colors);
      setPlayerNames(data.playerNames)
    });
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off("updateBingoField");
    };
  }, []);

  // Function to handle button clicks
  const buttonPressed = (index) => {
    const content = bingoChallenges[index];
    console.log(`Button ${index} pressed with Bingo Challenge: "${content}"`);
    //Changing Colors temporary until Server overwrites it.
    const newColors = [...bingoColors];
    newColors[index] = playerColor;
    setBingoColors(newColors);;
    //Sending the Server all Data from the Buttonpress
    socket.emit("buttonPressed", { colorIndex: index, playerColor: playerColor, socketId : socket.id });
  };


  //dynamic rendering of the buttons based on the bingoChallenges array and the bingoColors array
  const renderButtons = () => {
    return bingoChallenges.map((name, index) => (
      <button
        key={index}
        className="bingoFieldButton"
        onClick={() => buttonPressed(index)}
        style={{ backgroundColor: bingoColors[index] || "black" }}
      >
        {name}
      </button>
    ));
  };

  //dynamic playerNames rendering based on the playerNames array
  const renderPlayerNames = () => {
    return playerNames.map((name, index) => <div key={index}>{name}</div>);
  };

  return (
    
    <div className ="allContainer">
      <div className="header">
        <div className="playerNames">
          <label>Playercolor: </label>
          <select
            id="playercolor"
            value={playerColor}
            onChange={(e) => setPlayercolor(e.target.value)}
          >
            <option value="red">red</option>
            <option value="blue">blue</option>
            <option value="green">green</option>
            <option value="yellow">yellow</option>
            <option value="purple">purple</option>
            <option value="white">white</option>
          </select>
        </div>
        <div className="playerNames">Players: {renderPlayerNames()}</div>
      </div>
      <div className="bingoFieldButtonContainer">{renderButtons()}</div>
    </div>
  );
}

export default BingoPage;
