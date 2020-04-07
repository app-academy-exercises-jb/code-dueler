import React from "react";
import NavBar from "../components/nav/NavBar";
import PlayerChat from "../components/player/PlayerChat";
import ChallengeQuestion from "../components/player/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor"

export default () => {
  return (
    <div className="main">
      <NavBar />
      {/* <PlayerChat /> */}
      <ChallengeQuestion />
      <CodeEditor />
    </div>
  );
};
