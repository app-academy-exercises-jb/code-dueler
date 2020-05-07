import React from "react";

const NavBarPlayerCount = ({ data, inGame, inGameLobby }) => {
  let usersCount;
  
  if (!data) {
    usersCount = 0;
  } else {
    usersCount = data.users ? data.users.length : 0;
  }

  if (inGame) {
    return <>{data || 0} {data === 1 ? 'spectator' : 'spectators'}</>;
  } else if (inGameLobby) {
    return <>{data || 0} {data === 1 ? 'player' : 'players'} in the lobby</>;
  } else {
    return <>{usersCount} {usersCount === 1 ? 'user' : 'users'} ready to duel</>;
  }
};

export default NavBarPlayerCount;
