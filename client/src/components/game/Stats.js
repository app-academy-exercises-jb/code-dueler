import React, { useState } from "react";
import ReactModal from "react-modal";

const Stats = ({ ownStats, opponentStats, defStats }) => {
  ReactModal.setAppElement("#root");
  const [count, setCount] = useState(0);
  const [maxCount, setMaxCount] = useState(1);
  const [errorOpen, setErrorOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const stats = ownStats ? ownStats : opponentStats;
  let parsed;
  stats &&
    stats.lastSubmittedResult &&
    (parsed = JSON.parse(stats.lastSubmittedResult));
  if (parsed) console.log(parsed);

  const openTestResults = () => {
    setResultsOpen(true);
  };

  const openErrorResults = () => {
    setErrorOpen(true);
  };

  const handleModalClose = () => {
    setErrorOpen(false);
    setResultsOpen(false);
  };
  return (
    <>
      <div className="stats-form">
        <h1>{defStats}</h1>
        <br />
        <div className="stats">
          <h2>Passed: {(parsed && parsed.passed) || "false"}</h2>
          <br />
          <h2>Character Count: {(stats && stats.charCount) || 0}</h2>
          <br />
          <h2>Lines of Code: {(stats && stats.lineCount) || 0}</h2>
          <br />
          <h2>
            Passed Tests:{" "}
            {(parsed && parsed.passedTests && parsed.passedTests.toString()) ||
              "None"}
          </h2>
          <div className="stats-results">
            <h2 onClick={openTestResults}>Results</h2>
            <h2 onClick={openErrorResults}>Errors</h2>
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={errorOpen}
        className={`modal-overlay`}
        shouldCloseOnEsc={true}
        onRequestClose={() => setErrorOpen(false)}
      >
        <div className={`modal`}>
          <div className={`modal-info center`}>
            <h1></h1>
          </div>
          <div className="modal-buttons">
            <button
              className="modal-decline decline-hover"
              onClick={handleModalClose}
            >
              Close Errors
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default Stats;
