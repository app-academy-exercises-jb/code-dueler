import React, { useState } from "react";
import SideBarUsers from "./SideBarUsers";
import ReactModal from "react-modal";
import { useMutation } from "@apollo/react-hooks";
import { SPECTATE_USER } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";

const SideBar = ({ users, inGame }) => {
  ReactModal.setAppElement("#root");

  const [spectateModalOpen, setSpectateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const [spectate] = useMutation(SPECTATE_USER);

  const history = useHistory();

  const spectateUser = async (user) => {
    const {
      data: { spectateUser: gameId },
    } = await spectate({ variables: { player: user._id } });
    setSpectateModalOpen(false);
    if (gameId === "not ok") return;
    history.push(`/game/${gameId}`);
  };

  return (
    <div className="sidebar-wrapper">
      <div className="user-list-wrapper">
        {inGame && "Players"}
        <SideBarUsers 
          users={users}
          inGame={inGame}
          action={(user) => {
            if (!(user.inGame || user.inLobby)) return;
            setSelectedUser(user);
            setSpectateModalOpen(true);
          }}
          />
        <br />
        {inGame && "Spectators"}
      </div>
      <ReactModal
        isOpen={spectateModalOpen}
        className="modal-overlay"
        shouldCloseOnEsc={true}
        onRequestClose={() => setSpectateModalOpen(false)}
      >
        <div className="modal">
          <div className="modal-info">
            <h1>{selectedUser && selectedUser.username}</h1>
            <div>
              <p>is already in a duel!</p>
              Would you like to spectate?
            </div>
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
              onClick={() => spectateUser(selectedUser)}
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
