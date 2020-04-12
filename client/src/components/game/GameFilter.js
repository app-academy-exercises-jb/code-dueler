import React, { useEffect } from "react";
import GameScreen from "../../pages/GameScreen";
import Spectator from "../../pages/Spectator";
import { useParams, Redirect } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IN_GAME_INFO } from "../../graphql/queries";
import { SPECTATE_GAME } from "../../graphql/mutations";

export default ({ ...props }) => {
  const { id: gameId } = useParams();

  const { data, loading, error } = useQuery(IN_GAME_INFO, {
    variables: { gameId }
  });

  const [spectateGame] = useMutation(SPECTATE_GAME);

  const shouldUpdateSpectator = data && data.isSpectator;
  const shouldUpdateInGame = data && data.isInGame;

  useEffect(() => {
    if (data && !data.isInGame && !data.isSpectator) {
      debugger
      spectateGame({ variables: { gameId }});
    }
  }, [shouldUpdateSpectator, shouldUpdateInGame]);

  if (loading || error || !data) return null;

  const { queryGameInfo: { isInGame, isSpectator, gameExists }} = data;

  if (!gameExists) {
    return <Redirect to={'/'} />
  } else {
    if (!isSpectator && isInGame){
      return <GameScreen { ...props } gameId={gameId} />
    } else {
      return <Spectator { ...props } gameId={gameId} />
    }
  }
};
