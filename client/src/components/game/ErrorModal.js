import React from "react";

export default ({error, handleModalClose}) => {
  const defaultError = <>
  <pre>No errors yet!</pre>
  <pre>Keep up the great work!</pre>
  </>;

  return (
    <div className={`stats-modal error-block scroll`}>
      <div className={`stats-modal-info stats-modal-error center`}>
        {
        (error && error.stackTrace.split(/\n/).map(segment => (
          <pre>
            {segment}
          </pre>
        )))
        || defaultError
        }
      </div>
      <div className="stats-modal-buttons">
        <button
          className="modal-decline decline-hover"
          onClick={handleModalClose}
        >
          Close Errors
        </button>
      </div>
    </div>
  );
}