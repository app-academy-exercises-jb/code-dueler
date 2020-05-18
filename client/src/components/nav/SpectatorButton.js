import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { HANDLE_GAME } from '../../graphql/mutations';

const SpectatorButton = ({ players, gameId }) => {
  const [handleGame] = useMutation(HANDLE_GAME);

  const handleClick = e => {
    handleGame({variables: { gameId, action: "play" }});
  };

  return (
    <div 
      className="nav-button"
      onClick={handleClick}
    >
      <button>
        {players.length === 0
          ? 'Claim Host!'
          : 'Challenge Host!'
        }
      </button>
    </div>
  );
};

export default SpectatorButton;
