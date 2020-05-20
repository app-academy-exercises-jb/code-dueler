import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_GAME_USER_STATUS } from '../../graphql/mutations';

const ReadyGameButton = ({ ready, gameId, userId }) => {
  const [updateUserStatus] = useMutation(UPDATE_GAME_USER_STATUS);

  const handleClick = e => {
    updateUserStatus({variables: {
      player: userId,
      ready: !ready,
      gameId
    }})
  };

  return (
    <div 
      className="nav-button"
      onClick={handleClick}
    >
      <button>
        {ready
          ? 'Not Ready!'
          : 'Get Ready!'
        }
      </button>
    </div>
  );
};

export default ReadyGameButton;
