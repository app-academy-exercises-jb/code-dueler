import React from "react";
import Lobby from "../components/global/lobby";

export default (props) => {
  return (
    <div className="main">
      <div className="main-sub">
        <Lobby {...props} />
      </div>
    </div>
  );
};
