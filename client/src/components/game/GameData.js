import React, { useState } from 'react';
import { useSubscription } from "@apollo/react-hooks";
import { ON_GAME } from '../../graphql/subscriptions';
import { useHistory } from 'react-router-dom';

const GameData = ({ 
  gameId,
  spectator,
  gameStarted,
  setGameStarted,
  refetchGame,
  ...props
}) => {
  const history = useHistory();
  const [gameEvent, setGameEvent] = useState(null);

  useSubscription(ON_GAME, {
    fetchPolicy: "network-only",
    variables: {
      gameId,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.gameEvent;
      if (e.status !== gameStarted) {
        if (e.status === "over") {
          setGameStarted("over"); 
          setGameEvent(e);   
        } else {
          refetchGame()
            .then(res => {
              setGameStarted(res.data.queryGameInfo.gameStatus);
              setGameEvent(e);      
            })
            .catch(err => {
              history.push("/");
            });
        }
      } else {
        setGameEvent(e);
      }
    },
  });



  return props.children(gameEvent);
}

export default GameData;
