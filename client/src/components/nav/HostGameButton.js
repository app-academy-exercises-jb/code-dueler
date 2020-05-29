import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { HOST_GAME } from '../../graphql/mutations';
import { useHistory } from 'react-router-dom';

const HostGameButton = props => {
  const [hostGame] = useMutation(HOST_GAME);
  const history = useHistory();

  const handleClick = async e => {
    //show modal with host game options, such as: choose your challenge / language
    await hostGame({
      variables: {
        challenge: "FizzBuzz",
        language: "javascript"
      }})
      .then(async ({data: { hostGame: gameId }}) => {
        await props.refetchMe();
        return gameId;
      })
      .then(gameId => {
        if (gameId !== null) {
          history.push(`/game/${gameId}`);
        };
      });
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