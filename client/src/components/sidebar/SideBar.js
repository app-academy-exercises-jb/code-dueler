import React, { useState } from "react";
import SideBarUsers from "./SideBarUsers";
import ReactModal from "react-modal";
import { useMutation } from "@apollo/react-hooks";
import { JOIN_GAME, HANDLE_GAME } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";
import InGameUsers from "./InGameUsers";
import GamesList from "./GamesList";
import GameHost from "./GameHost";

const SideBar = ({ 
  users,
  games,
  players,
  spectators,
  inGame,
  gameSelfStatus,
  me,
  refetchMe,
  gameId,
  showUsers,
  showHost,
 }) => {
  ReactModal.setAppElement("#root");
  const [spectateModalOpen, setSpectateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [handleGame] = useMutation(HANDLE_GAME);
  const [join] = useMutation(JOIN_GAME);

  const history = useHistory();

  const joinGame = async ({user, game}) => {
    let variables = user 
      ? {player: user._id}
      : {gameId: game};

    const {
      data: { joinGame: gameId },
    } = await join({ variables });
    setSpectateModalOpen(false);

    // __TODO__ check if gameId starts with 'not ok:' and if so,
    // parse out the reason: let reason = gameId.split("not ok: ")[1];
    // and implement an error modal
    
    await refetchMe();
    setTimeout(() => {
      history.push(`/game/${gameId}`);
    }, 10);
  };

  const sideBarContent = () => {
    if (showUsers) {
      if (!inGame) {
        return (
          <SideBarUsers 
            users={users}
            inGame={inGame}
            action={(user) => {
              if (!(user.inGame || user.inLobby)) return;
              setSelectedUser(user);
              setSpectateModalOpen(true);
            }}
          />
        );
      } else {
        return (
          <InGameUsers
            players={players}
            spectators={spectators}
            gameSelfStatus={gameSelfStatus}
            me={me}
            gameId={gameId}
            handleGame={handleGame}
          />
        );
      }
    } else {
      if (showHost) {
        return <GameHost />
      } else {
        return (
        <GamesList 
          games={games}
          joinGame={joinGame}
        />
        );
      }
    }
  }

  let className = `sidebar-wrapper scroll ${showUsers && !showHost ? "" : "game-lobbies"}`;

  return (
    <div className={className}>
      <div className="user-list-wrapper">
        {sideBarContent()}
      </div>
      <ReactModal
        isOpen={spectateModalOpen}
        className="modal-overlay"
        shouldCloseOnEsc={true}
        onRequestClose={() => setSpectateModalOpen(false)}
      >
        <div className="modal">
          <div className="modal-info">
            {selectedUser && <>
            <h1>{selectedUser.username}</h1>
            <div>
              {selectedUser.inGame
                ? selectedUser.inLobby
                  ? <>
                    <p>is currently in a duel lobby!</p>
                    Would you like to join?
                    </>
                  : <>
                    <p>is already in a duel!</p>
                    Would you like to spectate?
                    </>
                : ''
              }
            </div>
            </>}
          </div>
          <div className="modal-buttons">
            <button
              className="modal-decline"
              onClick={() => setSpectateModalOpen(false)}
            >
              Decline
            </button>
            <button
              className="modal-accept"
              onClick={() => joinGame({user: selectedUser})}
            >
              Accept
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default SideBar;
