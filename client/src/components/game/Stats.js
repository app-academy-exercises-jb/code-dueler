import React, { useState } from "react";

const Stats = ({ ownStats, opponentStats, defStats }) => {
  const [errorOpen, setErrorOpen] = useState("error-hidden");
  const [resultsOpen, setResultsOpen] = useState("results-hidden");
  const stats = ownStats ? ownStats : opponentStats;
  let parsed;
  stats &&
    stats.lastSubmittedResult &&
    (parsed = JSON.parse(stats.lastSubmittedResult));

  let error = parsed && parsed.error ? parsed.error.stackTrace : null;
  let test, expected, result;
  if (parsed && parsed.checkedTests) {
    test = parsed.checkedTests[parsed.checkedTests.length - 1];
  }
  if (parsed && parsed.expected) {
    expected = parsed.expected.map((el, i) => {
      if (i !== parsed.expected.length - 1) {
        return `"${el}", `;
      } else {
        return `"${el}"`;
      }
    });
  }
  if (parsed && parsed.output) {
    result = parsed.output.map((el, i) => {
      if (i !== parsed.output.length - 1) {
        return `"${el}", `;
      } else {
        return `"${el}"`;
      }
    });
  }

  console.log(parsed);

  const openTestResults = () => {
    if (expected) {
      setResultsOpen("results-block");
    }
  };

  const openErrorResults = () => {
    if (error) {
      setErrorOpen("error-block");
    }
  };

  const handleModalClose = () => {
    setErrorOpen("error-hidden");
    setResultsOpen("results-hidden");
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
      <div className={`stats-modal-overlay ${errorOpen}`}>
        <div className={`stats-modal ${errorOpen}`}>
          <div className={`stats-modal-info center`}>{error}</div>
          <div className="stats-modal-buttons">
            <button
              className="modal-decline decline-hover"
              onClick={handleModalClose}
            >
              Close Errors
            </button>
          </div>
        </div>
      </div>
      <div className={`stats-modal-overlay ${resultsOpen}`}>
        <div className={`stats-modal ${resultsOpen}`}>
          <div className={`stats-modal-info center`}>
            <div className="stats-modal-results">
              Test case = {test}
              <br />
              Expected result = <code>[{expected}]</code>
              <br />
              Submitted code result = ["{result}"]
              <br />
            </div>
          </div>
          <div className="stats-modal-buttons">
            <button
              className="modal-decline decline-hover"
              onClick={handleModalClose}
            >
              Close Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
