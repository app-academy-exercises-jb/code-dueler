import React from "react";
import NavBar from "../components/nav/NavBar";
import PlayerChat from "../components/player/PlayerChat";
import ChallengeQuestion from "../components/player/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor"
import Stats from "../components/player/Stats";
import { useSubscription } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
// import { ON_GAME } from "../graphql/subscriptions";

export default ({ onlineUsers: {data, loading, error} }) => {
  const { id: gameId } = useParams();
  // useSubscription(ON_GAME, {
  //   fetchPolicy: "network-only",
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     const e = subscriptionData.data.gameEvent;
  //     if (e.status === "initializing") {
        
  //     } else if (e.status === "ready") {
        
  //     } else if (e.status === "ongoing") {
        
  //     } else if (e.status === "over") {
        
  //     }
  //   },
  // });

  return (
    <div className="main">
      {data && <NavBar data={data} />}
      <ChallengeQuestion />
      <Stats />
      <PlayerChat />
      <CodeEditor />
    </div>
  );
};
