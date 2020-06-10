import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export default ({ test, expected, output, handleModalClose }) => {
  const [expectedResult, setExpectedResult] = useState({long: "", trunc: ""});
  const [submittedResult, setSubmittedResult] = useState({long: "", trunc: ""});
  const [truncExpected, setTruncExpected] = useState(true);
  const [truncSubmitted, setTruncSubmitted] = useState(true);
  let stringified, trunc;

  const stringify = (obj) => {
    stringified = JSON.stringify(obj);
    trunc = stringified.length > 200
      ? stringified.slice(0,200) + "..."
      : stringified;
  }

  useEffect(() => {
    if (expected !== undefined) {
      stringify(expected);
      setExpectedResult({
        long: stringified,
        trunc
      });
    }
  }, [expected]);

  useEffect(() => {
    if (output !== undefined) {
      stringify(output);
      setSubmittedResult({
        long: stringified,
        trunc
      });
    }
  }, [output]);

  return (
    <div className={`stats-modal results-block scroll`}>
      <div className={`stats-modal-info center`}>
        <div className="stats-modal-results">
          Failed test case: {test}
          <br />
          Expected result: 
          <code
            className={expectedResult.trunc !== expectedResult.long ? "pointer" : ""}
            onClick={() => setTruncExpected(!truncExpected)}
          >
            {truncExpected ? expectedResult.trunc : expectedResult.long}
          </code>
          <br />
          Submitted code result: 
          <code
            className={submittedResult.trunc !== submittedResult.long ? "pointer" : ""}
            onClick={() => setTruncSubmitted(!truncSubmitted)}
          >
            {truncSubmitted ? submittedResult.trunc : submittedResult.long}
          </code>
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
  );
};
