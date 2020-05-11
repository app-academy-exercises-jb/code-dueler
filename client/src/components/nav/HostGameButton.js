import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { HOST_GAME } from '../../graphql/mutations';
import { useHistory } from 'react-router-dom';

const HostGameButton = props => {
  const [hostGame] = useMutation(HOST_GAME);
  const history = useHistory();

  const handleClick = async e => {
    const { data: { hostGame: gameId } } = await hostGame({variables: {challenge: "fizz-buzz"}});
    if (gameId !== null) {
      history.push(`/game/${gameId}`);
    };
  };

  return (
    <div 
      className="nav-button"
      onClick={handleClick}
    >
      <button>Host Game</button>
    </div>
  );
};

export default HostGameButton;