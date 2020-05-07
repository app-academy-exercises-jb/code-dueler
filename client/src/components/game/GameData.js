import React, { useState, useEffect } from 'react';
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { ON_GAME } from '../../graphql/subscriptions';

const GameData = ({ gameId, spectator, ...props}) => {
  const [gameEvent, setGameEvent] = useState(null);

  useSubscription(ON_GAME, {
    fetchPolicy: "network-only",
    variables: {
      gameId,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const e = subscriptionData.data.gameEvent;
      setGameEvent(e);      
    },
  });



  return props.children(gameEvent);
}

export default GameData;
