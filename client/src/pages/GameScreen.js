import React, { useState } from "react";
import NavBar from "../components/nav/NavBar";
import Chat from "../components/chat/Chat";
import ChallengeQuestion from "../components/game/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor";
import Stats from "../components/game/Stats";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { useParams, useHistory } from "react-router-dom";
import { ON_GAME } from "../graphql/subscriptions";
import ReactModal from "react-modal";

export default ({ onlineUsers, me }) => {
  const { loading, error, data } = me;
  const { id: gameId } = useParams();
  const history = useHistory();
  const [opponentStats, setOpponentStats] = useState(null);
  const [ownStats, setownStats] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");

  useSubscription(ON_GAME, {
    fetchPolicy: "network-only",
    variables: {
      gameId,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.gameEvent;

      let self, opponent;
      if (data && e.p1.player._id === data.me._id) {
        self = "p1";
        opponent = "p2";
      } else {
        opponent = "p1";
        self = "p2";
      }

      if (e.status === "initializing") {
        console.log("initializing");
      } else if (e.status === "ready") {
        console.log("ready");
      } else if (e.status === "ongoing") {
        setownStats(e[self]);
        setOpponentStats(e[opponent]);
      } else if (e.status === "over") {
        if (e.winner === self) {
          handleGameOver("victory");
        } else {
          handleGameOver("defeat");
        }
      }
    },
  });

  if (loading || error || !data) return null;

  const handleGameOver = (wincon) => {
    if (wincon === "defeat") {
      setGameOverMessage("You have been defeated!");
    } else {
      setGameOverMessage("You are victorious!");
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    history.push("/");
    // setModalOpen(false);
  };

  return (
    <div className="main">
      <NavBar noData={true} />
      <div className="game-screen">
        <div className="game-left">
          <div className="code-editor-wrapper">
            <CodeEditor gameId={gameId} me={data.me} />
          </div>
          <div className="stats-wrapper">
            <div className="stats-players">
              <Stats ownStats={ownStats} defStats={"Own Stats"} />
            </div>
            <div className="stats-players">
              <Stats
                opponentStats={opponentStats}
                defStats={"Opponent Stats"}
              />
            </div>
          </div>
        </div>
        <div className="game-right">
          <div className="challenge-question-wrapper">
            <ChallengeQuestion />
          </div>
          <div className="game-chat-wrapper">
            <Chat channelId={gameId} id={"game-chat"} me={me} />
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={modalOpen}
        className={`modal-overlay`}
        shouldCloseOnEsc={true}
        onRequestClose={() => setModalOpen(false)}
      >
        <div className={`modal`}>
          <div className={`modal-info center`}>
            <h1>{gameOverMessage}</h1>
          </div>
          <div className="modal-buttons">
            <button
              className="modal-decline decline-hover"
              onClick={handleModalClose}
            >
              Go back to the lobby
            </button>
            {/* <button className="game-over-stay">
            Hang out here
          </button>
          <button className="game-over-challenge">
            Rematch!
          </button> */}
          </div>
        </div>
      </ReactModal>
    </div>
  );
};
