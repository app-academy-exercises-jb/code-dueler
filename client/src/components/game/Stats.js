import React from "react";

export default ({
  ownStats, ownParsed,
  opponentStats, opponentParsed,
  title,
  openTestResults,
  openErrorResults,
}) => {
  let stats, name, parsed;

  if (ownStats) {
    stats = ownStats;
    parsed = ownParsed;
    name = "own";
  } else {
    stats = opponentStats;
    parsed = opponentParsed;
    name = "opponent";
  }

  console.log({parsed});
  const username = stats ? stats.player.username : "";
  return (
    <>
      <div className="stats-form">
        <h1 className="stats-title">{username}</h1>
        <div className="stats">
          <h2>Character Count: {(stats && stats.charCount) || 0}</h2>
          <h2>Lines of Code: {(stats && stats.lineCount) || 0}</h2>
          <h2>
            Passed Tests:{" "}
            {(parsed && parsed.score && `${parsed.score * 100}%`) ||
              "0%"}
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
