import React, { useRef, useState, useEffect } from "react";
import LogOutButton from "../users/LogOutButton";
import { Link, useHistory } from "react-router-dom";
import ProtectedComponent from "../util/ProtectedComponent";
import NavBarPlayerCount from "./NavBarPlayerCount";
import HostGameButton from "./HostGameButton";
import GameLobbyButton from "./GameLobbyButton";
import StartGameButton from "./StartGameButton";
import ReadyGameButton from "./ReadyGameButton";
import SpectatorButton from "./SpectatorButton";
import ToolTip from "../util/ToolTip";
import Credits from "../credits/Credits";
import {ReactComponent as BurgerIcon} from "../../images/hamburger_icon.svg"

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
  gameId,
  setShowUsers,
  showUsers
}) => {
  const burger = useRef();
  const [width, setWidth] = useState(window.innerWidth);
  const history = useHistory();

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getUserButton = () => {
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
  };

  const getNavButtons = () => {
    let lobbyComponent;

    if (inLobby) {
      lobbyComponent = <>
        <div>
          <ProtectedComponent component={HostGameButton} refetchMe={refetchMe}/>
        </div>
        <div>
          <ProtectedComponent 
            component={GameLobbyButton}
            setShowUsers={setShowUsers}
            showUsers={showUsers}
          />
        </div>
      </>;
    } else if (inGameLobby) {
      lobbyComponent = <ProtectedComponent>
        <div>
          {getUserButton()}
        </div>
      </ProtectedComponent>;
    }

    return <>
      {lobbyComponent}
      <div>
        <ProtectedComponent component={LogOutButton} refetchMeLogged={refetchMeLogged} />
      </div>
      <div>
        <div className="nav-button" onClick={() => history.push('/credits')}>
        <button>
          Credits
        </button>
        </div>
      </div>
    </>;
  }

  const shouldBurger = () => {
    if (width > 1000) return true;
    if (width < 681 && width > 610) return true;
    return false;
  }

  const closeMenu = e => {
    if (burger.current && !burger.current.contains(e.target)) {
      burger.current.classList.add("hidden");
      window.removeEventListener('click', closeMenu);
    }
  }

  const clickHandler = (e) => {
    e.stopPropagation();
    if (burger.current.classList.contains('hidden')) {
      burger.current.classList.remove("hidden");
      window.addEventListener('click', closeMenu);
    } else {
      burger.current.classList.add("hidden");
      window.removeEventListener('click', closeMenu);
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
              showUsers={showUsers}
            />
          )}
        </div>
        <div className="logo-wrapper">
          <Link to="/" className="logo-nav">
            CodeDueler
          </Link>
        </div>
        
        {shouldBurger()
        ? <div className="nav-buttons">
            {getNavButtons()}
          </div>
        : <div className="nav-burger" onClick={clickHandler}>
            <BurgerIcon fill="#D4F2D2" />
            <div className="burger-content hidden" ref={burger}>
              {getNavButtons()}
            </div>
          </div>
        }
      </div>
      <div className="nav-bar-spacer"></div>
    </>
  );
};

export default NavBar;
