import React, { useState, useEffect } from "react";
import NavBar from "../components/nav/NavBar";
import Chat from "../components/chat/Chat";
import ChallengeQuestion from "../components/game/ChallengeQuestion";
import CodeEditor from "../components/codeEditor/CodeEditor";
import { useHistory } from "react-router-dom";
import ReactModal from "react-modal";
import PlayerStats from "../components/game/PlayerStats";
import GameTour from "../components/tour/GameTour";

export default ({ me, gameId, refetchMeLogged, gameEvent, questionData }) => {
  const history = useHistory();
  const [opponentStats, setOpponentStats] = useState(null);
  const [ownStats, setOwnStats] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [spectators, setSpectators] = useState([]);

  useEffect(() => {
    if (me._id && gameEvent) {
      let self, opponent;
      if (gameEvent.p1.player._id === me._id) {
        self = "p1";
        opponent = "p2";
      } else {
        opponent = "p1";
        self = "p2";
      }

      if (gameEvent.status === "initializing") {
        
      } else if (gameEvent.status === "started") {
        setOwnStats(gameEvent[self]);
        setOpponentStats(gameEvent[opponent]);
      } else if (gameEvent.status === "over") {
        if (gameEvent.winner === null) {
          handleGameOver("disconnect");
        } else if (gameEvent.winner === self) {
          handleGameOver("victory");
        } else {
          handleGameOver("defeat");
        }
      }

      setSpectators(gameEvent.spectators);
    }
  
  }, [gameEvent, me._id]);

  if (gameEvent === null) return null;

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
    <div className="global">
      <NavBar
        inGame={true}
        userCount={spectators.length}
        refetchMeLogged={refetchMeLogged}
      />

      <div className="main">
        <div className="game-screen">
          <div className="game-left">
            <div className="code-editor-wrapper">
              <CodeEditor
                gameId={gameId}
                me={me}
                questionData={questionData}
              />
            </div>
            <div className="stats-wrapper">
              <PlayerStats
                me={me}
                ownStats={ownStats}
                opponentStats={opponentStats}
              />
            </div>
          </div>
          <div className="game-right">
            <div className="challenge-question-wrapper">
              <ChallengeQuestion 
                challenge={questionData && questionData.challenge}
                body={questionData && questionData.body}
              />
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

      <footer></footer>
    </div>
  );
};
