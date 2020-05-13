import React from "react";

const NavBarPlayerCount = ({ userCount, inGame, inGameLobby }) => {
  if (inGame) {
    return <>{userCount || 0} {userCount === 1 ? 'spectator' : 'spectators'}</>;
  } else if (inGameLobby) {
    return <>{userCount || 0} {userCount === 1 ? 'player' : 'players'} in lobby</>;
  } else {
    return <>{userCount} {userCount === 1 ? 'user' : 'users'} ready to duel</>;
  }
};

export default NavBarPlayerCount;
