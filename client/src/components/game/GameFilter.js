import React, { useEffect, useState } from "react";
import GameLobby from "../../pages/GameLobby";
import GameScreen from "../../pages/GameScreen";
import Spectator from "../spectator/Spectator";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IN_GAME_INFO } from "../../graphql/queries";
import { JOIN_GAME, LEAVE_GAME } from "../../graphql/mutations";
import GameData from "./GameData";

export default ({ me, ...props }) => {
  const { id: gameId } = useParams();
  let history = useHistory();
  let [joinedGame, setJoinedGame] = useState(me.inGame);
  let [gameStarted, setGameStarted] = useState("initializing");

  const { 
    data: gameData,
    loading: gameLoading,
    error: gameError,
    refetch: refetchGame,
    networkStatus
  } = useQuery(
    IN_GAME_INFO, {
    variables: { gameId },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    }
  );
  
  const [join] = useMutation(JOIN_GAME);
  const [leave] = useMutation(LEAVE_GAME);

  const leaveGame = () => leave({
    variables: {
      player: me._id,
      gameId,
    },
  });
  
  const shouldUpdateExists = gameData && gameData.queryGameInfo.gameExists;
  const shouldUpdateSpectator = gameData && gameData.queryGameInfo.isSpectator;
  const shouldUpdateInGame = gameData && gameData.queryGameInfo.isInGame;
  const gameStatus = gameData && gameData.queryGameInfo.gameStatus;
  
  useEffect(() => {
    async function joinGame() {
      await join({variables: {gameId}})
        .then(async res => {
          if (res.data && res.data.joinGame === 'wrong ws') {
            return history.push('/');
          }
          return await refetchGame();
        })
        .then(async res => {
          if (res.data 
              && !(res.data.joinGame === 'wrong ws'
              || res.data.joinGame === 'not ok')) {
            return await props.refetchMe();
          }
        })
        .then(res => {
          if (res.data && res.data.me.inGame === true) {
            setJoinedGame(true);
          }
        });
    }

    if (shouldUpdateExists === undefined) return () => {};
    if (shouldUpdateExists === false
        || gameStatus === 'wrong ws') {
      history.push('/');
    }

    if (joinedGame === false
        && shouldUpdateSpectator === false
        && shouldUpdateInGame === false) {
      joinGame();
    } else if ((gameStatus === "not ok"
      || shouldUpdateInGame === false)
      && joinedGame === false) {
        history.push('/');
    }
  }, [me.inGame, shouldUpdateInGame, shouldUpdateSpectator, gameStatus, gameData, gameLoading]);

  // function returned from useEffect will run on component unmount
  useEffect(
    () => () => {
      leaveGame();
      history.push('/');
    },
    []
  );

  if (gameError
    || !gameData
    || gameStatus === "not ok") return null;

  const { queryGameInfo } = gameData,
  { isInGame, isSpectator, gameExists } = queryGameInfo;

  if (!gameExists) {
    return <Redirect to={'/'} />
  } else {
    if (me.inGame === false
        && joinedGame === true
        && isInGame === true) {
      history.push('/');
      return null;
    }
    if (gameStatus === 'initializing') {
      return (
        <GameData 
          gameId={gameId}
          refetchGame={refetchGame}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
        >
          {gameEvent => <GameLobby 
            {...props}
            queryGameInfo={queryGameInfo}
            gameEvent={gameEvent}
            gameId={gameId}
            me={me}
          />}
        </GameData>
      );
    } else if (gameStatus === 'started') {
      if (!isSpectator && isInGame){
        return (
          <GameData 
            gameId={gameId}
            refetchGame={refetchGame}
            gameStarted={gameStarted}
            setGameStarted={setGameStarted}
          >
            {gameEvent => <GameScreen
              { ...props }
              gameEvent={gameEvent}
              gameId={gameId}
              me={me}
            />}
          </GameData>
        );
      } else {
        return (
          <GameData 
            gameId={gameId}
            refetchGame={refetchGame}
            gameStarted={gameStarted}
            setGameStarted={setGameStarted}
            spectator={true}
          >
            {gameEvent => <Spectator
              { ...props }
              gameEvent={gameEvent}
              gameId={gameId}
              me={me}
            />}
          </GameData>
        );
      }
    } else if (gameStatus === 'wrong ws') {
      return null;
    }
  }
};
