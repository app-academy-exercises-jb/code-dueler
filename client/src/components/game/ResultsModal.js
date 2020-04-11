import React, { useState } from "react";

export default ({test, expected, output, handleModalClose}) => {
  return (
  <div className={`stats-modal-overlay results-block`}>
    <div className={`stats-modal results-block`}>
      <div className={`stats-modal-info center`}>
        <div className="stats-modal-results">
          Test case = {test}
          <br />
          Expected result = <code>[{expected}]</code>
          <br />
          Submitted code result = {output}
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
)};
