import React from 'react';
import { useHistory } from 'react-router-dom';

const StartGameButton = props => {
  const history = useHistory();

  const handleClick = e => {
    // mutation to start game
  };

  return (
    <div 
      className="nav-button"
      onClick={handleClick}
    >
      <button>Start Game</button>
    </div>
  );
};

export default StartGameButton;