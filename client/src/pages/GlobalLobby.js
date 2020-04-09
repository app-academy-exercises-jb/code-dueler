import React from "react";
import Lobby from "../components/global/lobby";
import CodeEditor from "../components/codeEditor/CodeEditor";

export default props => {
  return (
    <div className="main">
      <Lobby {...props} />
    </div>
  );
};
