import React, { useEffect } from "react";
import GameLobby from "../../pages/GameLobby";
import GameScreen from "../../pages/GameScreen";
import Spectator from "../../pages/Spectator";
import { useParams, Redirect } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IN_GAME_INFO } from "../../graphql/queries";
import { SPECTATE_GAME, LEAVE_GAME } from "../../graphql/mutations";
import GameData from "./GameData";

export default ({ me, ...props }) => {
  const { id: gameId } = useParams();
  const { loading, error, data } = me;

  const { 
    data: gameData,
    loading: gameLoading,
    error: gameError,
    refetch: refetchGame 
  } = useQuery(
    IN_GAME_INFO, {
    variables: { gameId },
    fetchPolicy: "network-only",
    }
  );

  const [spectateGame] = useMutation(SPECTATE_GAME);
  const [leaveGame] = useMutation(LEAVE_GAME);

  const shouldUpdateExists = gameData && gameData.queryGameInfo.gameExists;
  const shouldUpdateSpectator = gameData && gameData.queryGameInfo.isSpectator;
  const shouldUpdateInGame = gameData && gameData.queryGameInfo.isInGame;

  useEffect(() => {
    setTimeout(() => {
      if (shouldUpdateExists === true
        && shouldUpdateInGame === false
        && shouldUpdateSpectator === false) {
        spectateGame({ variables: { gameId }});
      }
    }, 10);
  }, [shouldUpdateSpectator, shouldUpdateInGame]);

  // function returned from useEffect will run on component unmount
  useEffect(
    () => () => {
      if (!data) return;
      leaveGame({
        variables: {
          player: data.me._id,
          gameId,
        },
      });
    },
    []
  );

  if (gameLoading || gameError || !gameData
      || loading || error || !data) return null;

  const { queryGameInfo } = gameData,
  { isInGame, gameStatus, isSpectator, gameExists } = queryGameInfo;

  if (!gameExists) {
    return <Redirect to={'/'} />
  } else {
    if (gameStatus === 'initializing') {
      return (
        <GameData gameId={gameId}>
          {gameEvent => <GameLobby 
            {...props}
            queryGameInfo={queryGameInfo}
            gameEvent={gameEvent}
            gameId={gameId}
            me={data.me}
          />}
        </GameData>
      );
    } else if (gameStatus === 'started') {
      if (!isSpectator && isInGame){
        return (
          <GameData gameId={gameId}>
            {gameEvent => <GameScreen
              { ...props }
              gameEvent={gameEvent}
              gameId={gameId}
              me={data.me}
            />}
          </GameData>
        );
      } else {
        return (
          <GameData gameId={gameId} spectator={true}>
            {gameEvent => <Spectator
              { ...props }
              gameEvent={gameEvent}
              gameId={gameId}
              me={data.me}
            />}
          </GameData>
        );
      }
    }
  }
};
