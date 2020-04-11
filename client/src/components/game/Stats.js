import React from "react";

export default ({ ownStats, opponentStats, title, openTestResults, openErrorResults }) => {

  const stats = ownStats ? ownStats : opponentStats;
  let parsed;

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
            <h2 onClick={openTestResults}>Results</h2>
            <h2 onClick={openErrorResults}>Errors</h2>
          </div>
        </div>
      </div>
    </>
  );
};

// export default Stats;

