import React, { useState } from "react";

export default ({error, handleModalClose}) => (
  <div className={`stats-modal-overlay error-block`}>
    <div className={`stats-modal error-block`}>
      <div className={`stats-modal-info center`}>{error.stackTrace}</div>
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
