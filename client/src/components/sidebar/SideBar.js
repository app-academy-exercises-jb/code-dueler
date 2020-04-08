import React, { useState } from "react";
import SideBarUsers from "./SideBarUsers";
import ReactModal from "react-modal";

const SideBar = ({ data }) => {
  ReactModal.setAppElement("#root");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(data.users[0]);
  const handleModalOpen = async (user) => {
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
          <div className="modal info">
            <h1>{selectedUser.username}</h1>
            <p>has challenged you to a CODE DUEL!</p>
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
