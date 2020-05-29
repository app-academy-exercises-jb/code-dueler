import React from "react";

const ChallengeQuestion = ({challenge, body}) => {
  return (
    <div className="question-text-box scroll">
      <h1>{challenge}</h1>

      {body.split("\n").map(line => (
        <p>{line}</p>
      ))}
    </div>
  );
};

export default ChallengeQuestion;
