import React from "react";
import LogOutButton from "../users/LogOutButton";
import { Link } from "react-router-dom";
import ProtectedComponent from "../util/ProtectedComponent";
import NavBarPlayerCount from "./NavBarPlayerCount";
import HostGameButton from "./HostGameButton";
import JoinGameButton from "./JoinGameButton";
import StartGameButton from "./StartGameButton";
import ReadyGameButton from "./ReadyGameButton";
import SpectatorButton from "./SpectatorButton";
import ToolTip from "../util/ToolTip";

const NavBar = ({
  userCount,
  noData,
  inGame,
  inLobby,
  inGameLobby,
  refetchMe,
  refetchMeLogged,
  gameSelfStatus,
  players,
  playersReady,
  me,
  gameId
}) => {
  const getUserButtons = () => {
    if (gameSelfStatus === "host") {
      if (playersReady) {
        return <StartGameButton gameId={gameId} />
      } else {
        return (
          <ToolTip 
            content={"Two players must first be ready"} 
            positionClass="nav-tooltip"
          >
            <StartGameButton 
              displayClass='inactive'
            />
          </ToolTip>
        )
      }
    } else if (gameSelfStatus === "player") {
      return (
        <ReadyGameButton
          ready={playersReady}
          userId={me._id}
          gameId={gameId}
        />
      );
    } else if (gameSelfStatus === "spectator") {
      return (
        <SpectatorButton 
          players={players} 
          gameId={gameId}
        />
      );
    } 
  }

  return (
    <>
      <div className="nav-bar-wrapper">
        <div className="left-nav">
          {!noData && (
            <ProtectedComponent
              component={NavBarPlayerCount}
              userCount={userCount}
              inGame={inGame}
              inGameLobby={inGameLobby}
            />
          )}
        </div>
        <div className="other-left">&nbsp;</div>
        <div className="logo-wrapper">
          <Link to="/" className="logo-nav">
            CodeDueler
          </Link>
        </div>
        <div className="nav-buttons">
          {inLobby && <>
          <div>
            <ProtectedComponent component={HostGameButton} refetchMe={refetchMe}/>
          </div>
          <div>
            <ProtectedComponent component={JoinGameButton} />
          </div>
          </>}
          {inGameLobby && 
          <ProtectedComponent>
            {getUserButtons()}
          </ProtectedComponent>}
          <div>
            <ProtectedComponent component={LogOutButton} refetchMeLogged={refetchMeLogged} />
          </div>
        </div>
      </div>
      <div className="nav-bar-spacer"></div>
    </>
  );
};

export default NavBar;
