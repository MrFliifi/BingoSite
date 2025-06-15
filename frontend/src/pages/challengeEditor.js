import { useState, useEffect } from "react";
import "../styles/challengeEditor.css";
import { socket } from "../websocket/socket.js";

function ChallengeEditor() {
  const [addChallengeVar, setAddChallenge] = useState("");
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [selectedChallenges, setSelectedChallenges] = useState(new Set());

  useEffect(() => {
    socket.emit("requestChallenges", socket.id);

    socket.on("updateChallengeEditor", (challenges) => {
      setCurrentChallenges(challenges);
      //reset checkboxes when a new set comes
      setSelectedChallenges(new Set()); 
      console.log(challenges);
    });

    socket.on("errorMsg", (message) => {
      alert(message);
    });

    return () => {
      socket.off("updateChallengeEditor");
      socket.off("errorMsg");
    };
  }, []);

  function sendChallenge() {
    if (addChallengeVar.trim() === "") {
      alert("Field can´t be empty");
      return;
    }

    console.log(addChallengeVar);
    
    socket.emit("addChallenge", addChallengeVar.trim());
    //Clear the input field
    setAddChallenge(""); 
  }

  function deleteChallenge() {
    if (selectedChallenges.size === 0) {
      alert("Pick at least 1 Challenge to be deleted");
      return;
    }
    
    console.log(selectedChallenges);
    
    socket.emit("deleteChallenges", Array.from(selectedChallenges));
  }

  const toggleChallengeSelection = (challengeName) => {
    const newSelection = new Set(selectedChallenges);
    if (newSelection.has(challengeName)) {
      newSelection.delete(challengeName);
    } else {
      newSelection.add(challengeName);
    }
    setSelectedChallenges(newSelection);
  };

  const renderChallenges = () => {
    return currentChallenges.map((name, index) => (
      <label key={index}>
        <input
          type="checkbox"
          className="checkboxChallenges"
          checked={selectedChallenges.has(name)}
          onChange={() => toggleChallengeSelection(name)}
        />
        {name}
      </label>
    ));
  };

  return (
    <div className="allContainer">
      <div className="addChallengesContainer">
        <div className="text">AddChallenge:</div>
        <input
          className="fields"
          type="text"
          id="addChallenge"
          value={addChallengeVar}
          onChange={(e) => setAddChallenge(e.target.value)}
        />
        <button className="button" id="sendButton" onClick={sendChallenge}>
          Send Challenge
        </button>
      </div>
      <div className="deleteChallengesContainer">
        <div className="text">DeleteChallenge:</div>
        <div className="checkboxContainer">{renderChallenges()}</div>

        <button className="button" id="deleteButton" onClick={deleteChallenge}>
          Delete Challenges
        </button>
      </div>
    </div>
  );
}

export default ChallengeEditor;
