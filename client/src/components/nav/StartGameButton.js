import React from 'react';

const StartGameButton = props => {

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