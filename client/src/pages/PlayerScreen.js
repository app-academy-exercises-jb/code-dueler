import React from "react";
import NavBar from "../components/nav/NavBar";
import ChatMain from "../components/chat/ChatMain";
import ChallengeQuestion from "../components/player/ChallengeQuestion";

export default () => {
  return (
    <div className="main">
      <NavBar />
      <ChatMain />
      <ChallengeQuestion /> 
    </div>
  );
};
