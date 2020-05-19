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
import NavBar from "../nav/NavBar";

export default ({ me, gameEvent, ...props }) => {
  const { id: gameId } = useParams();
  const history = useHistory();
  const [player1Stats, setPlayer1Stats] = useState(null);
  const [player2Stats, setPlayer2Stats] = useState(null);
  const [spectators, setSpectators] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");

  useEffect(() => {
    if (gameEvent) {
      if (gameEvent.status === "started") {
        setPlayer1Stats(gameEvent.p1);
        setPlayer2Stats(gameEvent.p2);
      } else if (gameEvent.status === "over") {
        if (gameEvent.winner === null) {
          handleGameOver("disconnect");
        } else if (gameEvent.winner === "p1") {
          handleGameOver(gameEvent.p1.player.username);
        } else {
          handleGameOver(gameEvent.p2.player.username);
        }
      }

      setSpectators(gameEvent.spectators);
    }
  
  }, [gameEvent]);

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
    <div className="global">
      <NavBar
        userCount={spectators.length}
        inGame={true}
        refetchMeLogged={props.refetchMeLogged}
      />
      <div className="main">
        <div className="spectator-wrapper">
          <div className="screen-top">
            <div className="spectator-player1">
              <div className="code-editor-wrapper-spectator">
                <CodeEditor
                  gameId={gameId}
                  data={player1Stats && player1Stats.currentCode}
                  spectator={true}
                />
              </div>
            </div>
            <div className="player-stats">
              <div className="stats-wrapper-spectator">
                <PlayerStats
                  ownStats={player1Stats}
                  opponentStats={player2Stats}
                  spectator={true}
                />
              </div>
            </div>
            <div className="spectator-player2">
              <div className="code-editor-wrapper-spectator">
                <CodeEditor
                  gameId={gameId}
                  data={player2Stats && player2Stats.currentCode}
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
      </div>
      <footer></footer>
    </div>
  );
};
