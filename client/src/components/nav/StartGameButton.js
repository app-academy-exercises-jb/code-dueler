import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { HANDLE_GAME } from '../../graphql/mutations';

const StartGameButton = ({ gameId, displayClass }) => {
  const [handleGame] = useMutation(HANDLE_GAME);
  
  const handleClick = e => {
    if (displayClass === "inactive") return;
    handleGame({variables: { gameId, action: "start" }});
  };

  return (
    <div 
      className={`nav-button ${displayClass}`}
      onClick={handleClick}
    >
      <button className={displayClass || ''}>Start Game</button>
    </div>
  );
};

export default StartGameButton;