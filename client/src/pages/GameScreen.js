import React, { useState, useEffect } from "react";
import NavBar from "../components/nav/NavBar";
import Chat from "../components/chat/Chat";
import ChallengeQuestion from "../components/game/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { ON_GAME } from "../graphql/subscriptions";
import ReactModal from "react-modal";
import { LEAVE_GAME } from "../graphql/mutations";
import PlayerStats from "../components/game/PlayerStats";

export default ({ me, gameId }) => {
  const { loading, error, data } = me;
  const history = useHistory();
  const [gameEvent, setGameEvent] = useState(null);
  const [opponentStats, setOpponentStats] = useState(null);
  const [ownStats, setOwnStats] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [leaveGame] = useMutation(LEAVE_GAME);

  // function returned from useEffect will run on component unmount
  useEffect(
    () => () => {
      if (!data) return;
      leaveGame({
        variables: {
          player: data.me._id,
          gameId,
        },
      });
    },
    []
  );

  useSubscription(ON_GAME, {
    fetchPolicy: "network-only",
    variables: {
      gameId,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.gameEvent;
      setGameEvent(e);

      let self, opponent;
      if (e.p1.player._id === data.me._id) {
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
        console.log(data);
        setOwnStats(e[self]);
        setOpponentStats(e[opponent]);
      } else if (e.status === "over") {
        if (e.winner === null) {
          handleGameOver("disconnect");
        } else if (e.winner === self) {
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
    } else if (wincon === "victory") {
      setGameOverMessage("You are victorious!");
    } else if (wincon === "disconnect") {
      setGameOverMessage("Looks like your opponent left early...");
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    history.push("/");
    // setModalOpen(false);
  };

  return (
    <div className="main">
      <NavBar inGame={true} data={gameEvent && gameEvent.connections - 2}/>
      <div className="game-screen">
        <div className="game-left">
          <div className="code-editor-wrapper">
            <CodeEditor gameId={gameId} me={data.me} />
          </div>
          <div className="player-stats-game-wrapper">
            <div className="player-stats-game">
              <PlayerStats
                me={data.me}
                ownStats={ownStats}
                opponentStats={opponentStats}
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
