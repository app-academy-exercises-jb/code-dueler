import React, { useState } from "react";
import SideBarUsers from "./SideBarUsers";
import ReactModal from "react-modal";
import { useMutation } from "@apollo/react-hooks";
import { INVITE_PLAYER } from "../../graphql/mutations";

const SideBar = ({ data }) => {
  ReactModal.setAppElement("#root");

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(data.users[0]);

  const [invitePlayer, { invitee }] = useMutation(INVITE_PLAYER);

  const handleModalOpen = async (user) => {
    // Below is commented out while testing
    // invitePlayer({ variables: { invitee: user._id } });
    await setSelectedUser(user);
    modalOpen ? setModalOpen(false) : setModalOpen(true);
  };

  const handleAccept = () => {
    // Send some acceptance code
    setModalOpen(false);
  };

  const handleDecline = () => {
    // Send declination code
    setModalOpen(false);
  };
  return (
    <div className="sidebar-wrapper">
      <div className="user-list-wrapper">
        <SideBarUsers data={data} handleModalOpen={handleModalOpen} />
      </div>
      <ReactModal
        isOpen={modalOpen}
        className="modal-overlay"
        shouldCloseOnEsc={true}
        onRequestClose={handleDecline}
      >
        <div className="modal">
          <div className="modal-info">
            <h1>{selectedUser.username}</h1>
            <div>
              has challenged you to a <p>CODE DUEL!</p>
            </div>
          </div>
          <div className="modal-buttons">
            <button className="modal-decline" onClick={handleDecline}>
              Decline
            </button>
            <button className="modal-accept" onClick={handleAccept}>
              Accept
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default SideBar;
