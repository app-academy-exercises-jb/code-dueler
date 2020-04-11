import React from "react";

export default ({ ownStats, opponentStats, title, openTestResults, openErrorResults }) => {
  let stats, name, parsed;

  if (ownStats) {
    stats = ownStats;
    name = "own";
  } else {
    stats = opponentStats;
    name = "opponent";
  }

  return (
    <>
      <div className="stats-form">
        <h1>{title}</h1>
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
            <h2 onClick={() => openTestResults(name)}>Results</h2>
            <h2 onClick={() => openErrorResults(name)}>Errors</h2>
          </div>
        </div>
      </div>
    </>
  );
};
