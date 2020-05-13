import React, { useEffect, useState } from "react";
import NavBar from "../components/nav/NavBar";
import SideBar from "../components/sidebar/SideBar";
import Chat from "../components/chat/Chat";
import ChallengeQuestion from "../components/game/ChallengeQuestion";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_USERS_IN_GAME } from "../graphql/queries";

export default ({ gameId, gameEvent, refetchMe, me}) => {
  const history = useHistory();
  const [playersInGame, setPlayersInGame] = useState([me]);
  
  useEffect(() => {
    if (gameEvent === null) return;
    setPlayersInGame(gameEvent.spectators.concat(
      [gameEvent.p1.player],
      gameEvent.p2 && [gameEvent.p2.player] || []
    ));

    if (gameEvent.status === "initializing") {
      
    } else if (gameEvent.status === "started") {
      
    } else if (gameEvent.status === "over") {
      // __TODO__ inform user game has ended early (modal preferred)
      history.push('/');
    }
  
  }, [gameEvent]);

  if (gameEvent === null) return null;

  
  return (
    <div className="global">
      <NavBar
        inGameLobby={true}
        userCount={gameEvent && gameEvent.connections}
        refetchMe={refetchMe}
      />
      <div className="main" id="game-lobby">
        <SideBar
          users={playersInGame}
          inGame={true}
        />
        <div className="vertical-half">
          <div className="challenge-question-wrapper">
            <ChallengeQuestion />
          </div>
          <div className="game-chat-wrapper">
            <Chat channelId={gameId} id={"game-chat"} me={me} />
          </div>
        </div>
      </div>
    </div>
  );
};
