import React from 'react';
import { useHistory } from 'react-router-dom';

const JoinGameButton = props => {
  const history = useHistory();

  const handleClick = e => {
    history.push('/games')
  };

  return (
    <div 
      className="nav-button"
      onClick={handleClick}
    >
      <button>Join Game</button>
    </div>
  );
};

export default JoinGameButton;