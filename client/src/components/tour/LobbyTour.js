import React from "react";

export default (props) => {
  return (
    <>
      <div className="lobby-sidebar">
        <i class="fas fa-arrow-left tour-arrow"></i>
        <div className="tour-text-wrapper">
          <p className="tour-text">
            Click on a player's name to challenge them to a
            <p className="code-duel">CODE DUEL</p>
          </p>
          <div className="button-wrapper">
            <button className="tour-button">Previous</button>
            <button className="tour-button">Next</button>
          </div>
        </div>
      </div>
      <div className="lobby-chat"></div>
      <div className="lobby-button"></div>
    </>
  );
};
