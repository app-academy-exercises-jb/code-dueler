import React from "react";
import NavBar from "../components/nav/NavBar";
import PlayerChat from "../components/player/PlayerChat";
import ChallengeQuestion from "../components/player/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor"
import Stats from "../components/player/Stats";

export default () => {
  return (
    <div className="main">
      <NavBar />
      <ChallengeQuestion />
      <Stats />
      <PlayerChat />
      <CodeEditor />
    </div>
  );
};
