import React, { useEffect, useState } from "react";
import NavBar from "../components/nav/NavBar";
import SideBar from "../components/sidebar/SideBar";
import Chat from "../components/chat/Chat";
import ChallengeQuestion from "../components/game/ChallengeQuestion";
import { useHistory } from "react-router-dom";
import ReactModal from "react-modal";

export default ({ gameId, gameEvent, refetchMe, refetchMeLogged, me}) => {
  const history = useHistory();
  const [playersInGame, setPlayersInGame] = useState([]),
    [spectatorsInGame, setSpectatorsInGame] = useState([]),
    [modalOpen, setModalOpen] = useState(false),
    [gameSelfStatus, setGameSelfStatus] = useState("player"),
    [playersReady, setPlayersReady] = useState(false);
  
  useEffect(() => {
    if (gameEvent === null) return;
    setPlayersInGame([].concat(
      (gameEvent.p1 && [{ ready: gameEvent.p1.ready, ...gameEvent.p1.player}]) || [],
      (gameEvent.p2 && [{ ready: gameEvent.p2.ready, ...gameEvent.p2.player}]) || []
    ));
    setSpectatorsInGame(gameEvent.spectators);
    setPlayersReady(gameEvent.p1 && gameEvent.p1.ready
      && gameEvent.p2 && gameEvent.p2.ready);

    if (gameEvent.p1 && me._id === gameEvent.p1.player._id) {
      setGameSelfStatus("host");
    } else if (gameEvent.p2 && me._id === gameEvent.p2.player._id) {
      setGameSelfStatus("player");
    } else {
      setGameSelfStatus("spectator");
    }

    if (gameEvent.status === "initializing") {
      
    } else if (gameEvent.status === "started") {
      
    } else if (gameEvent.status === "over") {
      // __TODO__ inform user game has ended early (modal preferred)
      setModalOpen(true);
    }
  
  }, [gameEvent]);

  const handleClose = () => {
    setModalOpen(false);
    history.push('/');
  }

  if (gameEvent === null) return null;

  
  
  return (
    <div className="global">
      <NavBar
        inGameLobby={true}
        userCount={gameEvent && gameEvent.connections}
        refetchMe={refetchMe}
        gameSelfStatus={gameSelfStatus}
        me={me}
        gameId={gameId}
        playersReady={playersReady}
        players={playersInGame}
        refetchMeLogged={refetchMeLogged}
      />
      <div className="main" id="game-lobby">
        <SideBar
          players={playersInGame}
          spectators={spectatorsInGame}
          inGame={true}
          gameSelfStatus={gameSelfStatus}
          me={me}
          gameId={gameId}
          showUsers={true}
        />
        <div className="vertical-half">
          <div className="challenge-question-wrapper">
            <ChallengeQuestion />
          </div>
          <div className="game-chat-wrapper">
            <Chat channelId={gameId} id={"game-chat"} me={me} />
          </div>
        </div>
        <ReactModal
          isOpen={modalOpen}
          className={`modal-overlay`}
          shouldCloseOnEsc={true}
          onRequestClose={() => handleClose()}
          >
          <div className={`modal`}>
            <div className={`modal-info center`}>
              <h1>Looks like the game is over early</h1>
            </div>
            <div className="modal-buttons">
              <button
                className="modal-decline decline-hover"
                onClick={handleClose}
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
    </div>
  );
};
