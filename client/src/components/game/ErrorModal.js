import React, { useState } from "react";

export default ({error, handleModalClose}) => {
  const defaultError = `
  No errors yet!
  Keep up the great work!
  `;

  return (
  <div className={`stats-modal-overlay error-block`}>
    <div className={`stats-modal error-block`}>
      <div className={`stats-modal-info center`}>{(error && error.stackTrace) || defaultError}</div>
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
);
}