import React from 'react';
import ToolTip from '../util/ToolTip';
import Cross from "../../images/cross.png"
import SideBarUsers from './SideBarUsers';

const InGameUsers = ({
  players,
  spectators,
  gameSelfStatus,
  me,
  gameId,
  handleGame
}) => {
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

  const getContent = (section, players) => {
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

  return ([
    ['Players', players],
    ['Spectators', spectators],
  ].map(([section, users]) => (
  <div key={section}>
    <div className={`sidebar-section`}>
      <ToolTip 
        content={getContent(section, players)}
        time={200}
        positionClass='section-tooltip'
      >
        <p
          onClick={() => sectionHandler(section)}
        >{section}</p>
      </ToolTip>
      <ToolTip
        content={getContent(section, players)}
        time={200}
        positionClass='section-button-tooltip'
      >
        <img
          src={Cross}
          onClick={() => sectionHandler(section)}
          alt={`Join ${section}`}
        />
      </ToolTip>
      
    </div>
    <SideBarUsers 
      users={users}
      playersSection={section==='Players'}
      inGame={true}
      action={() => {}}
      gameSelfStatus={gameSelfStatus}
      me={me}
      gameId={gameId}
    />
    <br />
    </div>)
  ))
};

export default InGameUsers;