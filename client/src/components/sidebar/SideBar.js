import React, { useState } from "react";
import SideBarUsers from "./SideBarUsers";
import ReactModal from "react-modal";
import { useMutation } from "@apollo/react-hooks";
import { JOIN_GAME } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";

const SideBar = ({ users, players, spectators, inGame, gameSelfStatus, me }) => {
  ReactModal.setAppElement("#root");

  const [spectateModalOpen, setSpectateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const [join] = useMutation(JOIN_GAME);

  const history = useHistory();

  const joinGame = async (user) => {
    const {
      data: { joinGame: gameId },
    } = await join({ variables: { player: user._id } });
    setSpectateModalOpen(false);
    if (gameId === "not ok") return;
    history.push(`/game/${gameId}`);
  };

  return (
    <div className="sidebar-wrapper">
      <div className="user-list-wrapper">
        {!inGame && 
          <SideBarUsers 
            users={users}
            inGame={inGame}
            action={(user) => {
              if (!(user.inGame || user.inLobby)) return;
              setSelectedUser(user);
              setSpectateModalOpen(true);
            }}
          />
        }
        {inGame && [
          ['Players', players],
          ['Spectators', spectators],
        ].map(([section, users]) => (
        <div key={section}>
          <div className={`sidebar-section`}>
            <p>{section}</p>
            <p>+</p>
          </div>
          <SideBarUsers 
            users={users}
            playersSection={section==='Players'}
            inGame={inGame}
            action={() => {}}
            gameSelfStatus={gameSelfStatus}
            me={me}
          />
          <br />
        </div>))}
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
              {selectedUser.inGame && <><p>is already in a duel!</p>
              Would you like to spectate?</>}
              {selectedUser.inLobby && <><p>is preparing for a duel!</p>
              Would you like to join?</>}
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
              onClick={() => joinGame(selectedUser)}
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
