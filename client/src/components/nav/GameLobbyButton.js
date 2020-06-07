import React from 'react';

const GameLobbyButton = ({ 
  setShowUsers,
  setShowHost,
  showUsers,
  showHost,
}) => {
  const handleClick = e => {
    if (showHost) {
      setShowHost(false);
    } else {
      setShowUsers(!showUsers);
    }
  };

  return (
    <div 
      className="nav-button"
      onClick={handleClick}
    >
      <button>{showUsers || showHost ? "Join Game" : "Global Lobby"} </button>
    </div>
  );
};

export default GameLobbyButton;