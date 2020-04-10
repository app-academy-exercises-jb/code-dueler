import React from "react";



const Stats = ({ownStats, opponentStats}) => {
    const stats = ownStats ? ownStats : opponentStats;
    let parsed;
    stats && stats.lastSubmittedResult && (parsed = JSON.parse(stats.lastSubmittedResult));
    return (
        <>
            <div className="stats-form">
                <h1>{ownStats ? "Own Stats" : "Opponent Stats"}</h1>
                <br/>
                <div className="stats">
                <h2>Passed: {parsed && parsed.passed || "false"}</h2>
                <br />
                <h2>Character Count: {stats && stats.charCount || 0}</h2>
                <br />
                <h2>Lines of Code: {stats && stats.lineCount || 0}</h2>
                <br />
                <h2>Passed Tests: {parsed && parsed.passedTests && parsed.passedTests.toString() || "None"}</h2>
                {parsed && parsed.error && <h2>ERROR: {parsed.error}</h2>}
                </div>

            </div>
        </>
    );
};

export default Stats;
