import React, { useState } from "react";
import SideBarUsers from "./SideBarUsers";
import ReactModal from "react-modal";
import { useMutation } from "@apollo/react-hooks";
import { JOIN_GAME, HANDLE_GAME } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";
import ToolTip from "../util/ToolTip";
import Cross from "../../images/cross.png"

const SideBar = ({ users, players, spectators, inGame, gameSelfStatus, me, refetchMe, gameId }) => {
  ReactModal.setAppElement("#root");

  const [spectateModalOpen, setSpectateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [handleGame] = useMutation(HANDLE_GAME);
  const [join] = useMutation(JOIN_GAME);

  const history = useHistory();

  const joinGame = async (user) => {
    const {
      data: { joinGame: gameId },
    } = await join({ variables: { player: user._id } });
    setSpectateModalOpen(false);
    if (gameId === "not ok") return;
    await refetchMe();
    setTimeout(() => {
      history.push(`/game/${gameId}`);
    }, 10);
  };

  const sectionHandler = section => {
    if (section === "Spectators") {
      if (gameSelfStatus !== 'spectator') {
        handleGame({variables: { gameId, action: "spectate" }});
      }
    } else if (section === "Players") {
      if (players.length < 2 && gameSelfStatus === 'spectator') {
        handleGame({variables: { gameId, action: "play" }});
      }
    }
  };

  const getContent = (section, users) => {
    if (section === 'Players') {
      switch (gameSelfStatus) {
        case 'host': return "You're already host!";
        case 'player': return "You're already a player!";
        case 'spectator': return (
          players.length === 2 
            ? "Players already full!"
            : players.length === 1
              ? "Challenge host!"
              : "Claim host!");
        default: throw `unknown game self status: ${gameSelfStatus}`;
      }
    } else {
        switch (gameSelfStatus) {
          case 'host': case 'player': 
            return 'Become a spectator';
          case 'spectator': return "You're already a spectator!";
          default: throw `unknown game self status: ${gameSelfStatus}`;
        }
    }
  };

  return (
    <div className="sidebar-wrapper scroll">
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
            <ToolTip 
              content={getContent(section, users)}
              time={200}
              positionClass='section-tooltip'
            >
              <p
                onClick={() => sectionHandler(section)}
              >{section}</p>
            </ToolTip>
            <ToolTip
              content={getContent(section, users)}
              time={200}
              positionClass='section-button-tooltip'
            >
              <img
                src={Cross}
                onClick={() => sectionHandler(section)}
              />
            </ToolTip>
            
          </div>
          <SideBarUsers 
            users={users}
            playersSection={section==='Players'}
            inGame={inGame}
            action={() => {}}
            gameSelfStatus={gameSelfStatus}
            me={me}
            gameId={gameId}
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
              {selectedUser.inGame
                ? <>
                  <p>is already in a duel!</p>
                  Would you like to spectate?
                  </>
                : selectedUser.inLobby
                  ? <>
                    <p>is in a duel lobby!</p>
                    Would you like to join?
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
