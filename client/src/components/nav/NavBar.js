import React from "react";
import LogOutButton from "../users/LogOutButton";
import { Link } from "react-router-dom";
import ProtectedComponent from "../util/ProtectedComponent";
import NavBarPlayerCount from "./NavBarPlayerCount";
import HostGameButton from "./HostGameButton";
import JoinGameButton from "./JoinGameButton";

const NavBar = ({ data, noData, inGame, inLobby, inGameLobby, refetchMe }) => {
  return (
    <>
      <div className="nav-bar-wrapper">
        <div className="left-nav">
          {!noData && (
            <ProtectedComponent
              component={NavBarPlayerCount}
              data={data}
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
            <ProtectedComponent component={HostGameButton} />
          </div>
          <div>
            <ProtectedComponent component={JoinGameButton} />
          </div>
          </>}
          <div>
            <ProtectedComponent component={LogOutButton} refetchMe={refetchMe} />
          </div>
        </div>
      </div>
      <div className="nav-bar-spacer"></div>
    </>
  );
};

export default NavBar;
