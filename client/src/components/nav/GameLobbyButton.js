import React from 'react';
import { useHistory } from 'react-router-dom';

const GameLobbyButton = ({ 
  setShowUsers,
  showUsers,
  ...props
}) => {
  const history = useHistory();

  const handleClick = e => {
    setShowUsers(!showUsers);
  };

  return (
    <div 
      className="nav-button"
      onClick={handleClick}
    >
      <button>{showUsers ? "Join Game" : "Global Lobby"} </button>
    </div>
  );
};

export default GameLobbyButton;