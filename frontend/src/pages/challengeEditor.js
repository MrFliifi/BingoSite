import { useState, useEffect } from "react";
import "../styles/challengeEditor.css";
import { socket } from "../websocket/socket.js";

function ChallengeEditor() {
  const [addChallengeVar, setAddChallenge] = useState("");
  const [deleteChallengeVar, setDeleteChallenge] = useState("");
  const [currentChallenges, setCurrentChallenges] = useState("");

  socket.emit("requestChallenges", socket.id);

  useEffect(() => {
    socket.on("updateChallengeEditor", (challenges) => {
      setCurrentChallenges(challenges);
    });

    socket.on("errorMsg", (message) => {
      alert(message);
    });

    return () => {
      socket.off("updateChallengeEditor");
      socket.off("errorMsg");
    };
  }, []);

  function deleteChallenge() {}

  function sendChallenge() {}

  const renderChallenges = () => {
    return currentChallenges.map((name, index) => (
      <input key={index} className="checkboxChallenges" type="checkbox">
        {name}
      </input>
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
        ></input>
        <button
          className="button"
          id="sendButton"
          onClick={() => sendChallenge()}
        >
          Send Challenge
        </button>
      </div>
      <div className="deleteChallengesContainer">
        <div className="text">DeleteChallenge:</div>
        <input>
          {renderChallenges()}
        </input>
        <button
          className="button"
          id="deleteButton"
          onClick={() => deleteChallenge()}
        >
          Delete Challenges
        </button>
      </div>
    </div>
  );
}

export default ChallengeEditor;
