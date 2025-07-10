import React from "react";
import "../styles/challengesModal.css"; // You'll add basic styles here

const ChallengesModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        
      </div>
    </div>
  );
};

export default ChallengesModal;
