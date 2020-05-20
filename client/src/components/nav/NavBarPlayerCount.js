import React from "react";

const NavBarPlayerCount = ({ showUsers, userCount, inGame, inGameLobby }) => {
  if (inGame) {
    return <>{userCount || 0} {userCount === 1 ? 'spectator' : 'spectators'}</>;
  } else if (inGameLobby) {
    return <>{userCount || 0} {userCount === 1 ? 'player' : 'players'} in lobby</>;
  } else {
    if (showUsers) {
      return <>{userCount} {userCount === 1 ? 'user' : 'users'} online</>;
    } else {
      return <>{userCount} {userCount === 1 ? 'game' : 'games'} being played</>;
    }
  }
};

export default NavBarPlayerCount;
