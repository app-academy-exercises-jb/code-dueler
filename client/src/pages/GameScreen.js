import React, { useState } from "react";
import NavBar from "../components/nav/NavBar";
import Chat from "../components/chat/Chat";
import ChallengeQuestion from "../components/player/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor";
import Stats from "../components/player/Stats";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { useParams, useHistory } from "react-router-dom";
import { ON_GAME } from "../graphql/subscriptions";

export default ({ onlineUsers, me}) => {
  const {loading, error, data} = me;
  const { id: gameId } = useParams();
  const history = useHistory();
  const [opponentStats, setOpponentStats] = useState(null);
  const [ownStats, setownStats] = useState(null);

  useSubscription(ON_GAME, {
    fetchPolicy: "network-only",
    variables: {
      gameId,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.gameEvent;
      let self, opponent;
      if (data && e.p1.player._id === data.me) {
        self = "p1";
        opponent = "p2";
      } else {
        opponent = "p1";
        self = "p2";
      }
      
      if (e.status === "initializing") {
        console.log("initializing")
      } else if (e.status === "ready") {
        console.log("ready");
      } else if (e.status === "ongoing") {
        console.log("ongoing");
        setownStats(e[self]);
        setOpponentStats(e[opponent]);
      } else if (e.status === "over") {
        history.push("/");
      }
    },
  });


  if (loading || error || !data) return null;

  return (
    <div className="main">
      <NavBar noData={true} />
      <div className="game-screen">
        <div className="game-left">
          <div className="challenge-question-wrapper">
            <ChallengeQuestion />
          </div>
          <div className="code-editor-wrapper">
            <CodeEditor gameId={gameId} me={data.me} />
          </div>
        </div>
        <div className="game-right">
          <div className="stats-wrapper">
            <div className="stats-players">
              <Stats ownStats={ownStats} />
            </div>
            <div className="stats-players">
              <Stats opponentStats={opponentStats} />
            </div>
          </div>
          <div className="game-chat-wrapper">
            <Chat channelId={gameId} id={"game-chat"} me={me}/>
          </div>
        </div>
      </div>
    </div>
  );
};
