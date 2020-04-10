import React, { useState } from "react";
import ReactModal from "react-modal";

const Test = (props) => {
  ReactModal.setAppElement("#root");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalVictory, setModalVictory] = useState(null);
  const [gameOver, setGameOver] = useState("");
  const [gameOverMessage, setGameOverMessage] = useState("");

  const handleGameOver = (wincon) => {
    if (wincon === "defeat") {
      setGameOver("defeat");
      setGameOverMessage("You have been defeated!");
    } else {
      setGameOver("victory");
      setGameOverMessage("You are victorious!");
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => handleGameOver("defeat")}>DEFEAT</button>
      <button onClick={() => handleGameOver("victory")}>VICTORY</button>
      <ReactModal
        isOpen={modalOpen}
        className={`modal-overlay`}
        shouldCloseOnEsc={true}
        onRequestClose={() => setModalOpen(false)}
      >
        <div className={`modal`}>
          <div className={`modal-info center`}>
            <h1>{gameOverMessage}</h1>
          </div>
          <div className="modal-buttons">
            <button
              className="modal-decline decline-hover"
              onClick={handleModalClose}
            >
              Go back to the lobby
            </button>
            {/* <button className="game-over-stay">
            Hang out here
          </button>
          <button className="game-over-challenge">
            Rematch!
          </button> */}
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default Test;
