import React from "react";
import NavBar from "../components/nav/NavBar";
import Chat from "../components/chat/Chat";
import ChallengeQuestion from "../components/player/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor";
import Stats from "../components/player/Stats";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { useParams, useHistory } from "react-router-dom";
import { ON_GAME } from "../graphql/subscriptions";

export default ({ onlineUsers: { data, loading, error } }) => {
  const { id: gameId } = useParams();
  const history = useHistory();

  useSubscription(ON_GAME, {
    fetchPolicy: "network-only",
    variables: {
      gameId,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.gameEvent;
      console.log({ data: e });
      // debugger;
      if (e.status === "initializing") {
        alert("initializing");
      } else if (e.status === "ready") {
        console.log("ready");
      } else if (e.status === "ongoing") {
        console.log("ongoing");
      } else if (e.status === "over") {
        console.log("over");
        alert("Your opponent has left the game!");
        history.push("/");
      }
    },
  });
  return (
    <div className="main">
      {data && <NavBar data={data} />}
      <div className="game-screen">
        <div className="game-left">
          <div className="challenge-question-wrapper">
            <ChallengeQuestion />
          </div>
          <div className="code-editor-wrapper">
            <CodeEditor gameId={gameId} />
          </div>
        </div>
        <div className="game-right">
          <div className="stats-wrapper">
            <div className="stats-players">
              <Stats />
            </div>
            <div className="stats-players">
              <Stats />
            </div>
          </div>
          <div className="game-chat-wrapper">
            <Chat channelId={gameId} id={"game-chat"} />
          </div>
        </div>
      </div>
    </div>
  );
};
