import React, { useState, useEffect } from "react";
import Chat from "../chat/Chat";
import ChallengeQuestion from "../game/ChallengeQuestion";
import CodeEditor from "../codeEditor/CodeEditor";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { useParams, useHistory } from "react-router-dom";
import { ON_GAME } from "../../graphql/subscriptions";
import ReactModal from "react-modal";
import { LEAVE_GAME } from "../../graphql/mutations";
import PlayerStats from "../game/PlayerStats";

export default ({ me }) => {
  // debugger;
  const { loading, error, data } = me;
  const { id: gameId } = useParams();
  const history = useHistory();
  // const [gameEvent, setGameEvent] = useState(null);
  const [player1Stats, setPlayer1Stats] = useState(null);
  const [player2Stats, setPlayer2Stats] = useState(null);
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
      const { p1, p2, status, winner } = subscriptionData.data.gameEvent;
      console.log("inside the onSubscriptionData");
      if (status === "initializing") {
        console.log("initializing");
      } else if (status === "ready") {
        console.log("ready");
      } else if (status === "ongoing") {
        console.log(data);
        setPlayer1Stats(p1);
        setPlayer2Stats(p2);
      } else if (status === "over") {
        // fix this return
        // if (winner === null) {
        //   handleGameOver("disconnect");
        // } else if (winner === self) {
        //   handleGameOver("victory");
        // } else {
        //   handleGameOver("defeat");
        // }
      }
    },
  });

  if (loading || error || !data) return null;

  const handleGameOver = (winner) => {
    if (winner === "disconnect") {
      setGameOverMessage("Looks like someone left early...");
    } else {
      setGameOverMessage(`${winner} is the winner!`);
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    history.push("/");
  };

  // console.log(player1Stats);

  return (
    <div className="main-spectator">
      <div className="spectator-wrapper">
        <div className="screen-top">
          <div className="spectator-player1">
            <div className="player-components">
              <div className="code-editor-wrapper-spectator">
                <CodeEditor
                  gameId={gameId}
                  ownStats={player1Stats}
                  spectator={true}
                />
              </div>
              <div className="player-stats">
                <PlayerStats
                  me={data.me}
                  player1Stats={player1Stats}
                  opponentStats={player2Stats}
                />
              </div>
            </div>
          </div>
          <div className="spectator-player2">
            <div className="code-editor-wrapper">
              <CodeEditor
                gameId={gameId}
                opponentStats={player2Stats}
                spectator={true}
              />
            </div>
          </div>
        </div>
        <div className="screen-bottom">
          <div className="challenge-question-wrapper-spectator">
            <ChallengeQuestion />
          </div>
          <div className="game-chat-wrapper-spectator">
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
          </div>
        </div>
      </ReactModal>
    </div>
  );
};
