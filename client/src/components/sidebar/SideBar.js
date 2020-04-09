
import React, { useState } from "react";
import SideBarUsers from "./SideBarUsers";
import ReactModal from "react-modal";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { ON_INVITATION } from "../../graphql/subscriptions";
import { ACCEPT_INVITE, DECLINE_INVITE } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";

const SideBar = ({ data }) => {
  ReactModal.setAppElement("#root");

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(data.users[0]);

  const [acceptInvite] = useMutation(ACCEPT_INVITE);
  const [declineInvite] = useMutation(DECLINE_INVITE);

  const history = useHistory();

  useSubscription(ON_INVITATION, {
    fetchPolicy: "network-only",
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.invitationEvent;
      if (e.status === "inviting") {
        handleModalOpen(e.inviter);
      } else if (e.status === "declined") {
        // setSelectedUser(e.invitee)
        // setDeclineModalOpen(true)
        // // => "invitee declined your invite"
        alert(`${e.invitee.username} declined`)
      } else if (e.status === "accepted") {
        // Go to the game screen
        history.push(`/game/${e.gameId}`);
      }
    },
  });

  const handleModalOpen = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleAccept = (user) => {
    acceptInvite({ variables: { inviter: user._id } });
    setModalOpen(false);
  };

  const handleDecline = (user) => {
    declineInvite({ variables: { inviter: user._id } });
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
            <h1>{selectedUser && selectedUser.username}</h1>
            <div>
              has challenged you to a <p>CODE DUEL!</p>
            </div>
          </div>
          <div className="modal-buttons">
            <button className="modal-decline" onClick={() => handleDecline(selectedUser)}>
              Decline
            </button>
            <button className="modal-accept" onClick={() => handleAccept(selectedUser)}>
              Accept
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default SideBar;
