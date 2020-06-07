import React, { useState } from "react";
import NavBar from "../components/nav/NavBar";
import SideBar from "../components/sidebar/SideBar";
import Chat from "../components/chat/Chat";
import LobbyTour from "../components/tour/LobbyTour";

export default ({users, games, me, refetchMe, refetchMeLogged}) => {
  const [showUsers, setShowUsers] = useState(true);
  const [showHost, setShowHost] = useState(false);

  return (
    <div className="global">
      <LobbyTour />
      <NavBar
        userCount={showUsers ? users.length : games.length}
        refetchMeLogged={refetchMeLogged}
        inLobby={true}
        refetchMe={refetchMe}
        setShowUsers={setShowUsers}
        showUsers={showUsers}
        setShowHost={setShowHost}
        showHost={showHost}
      />
      <div className="main">
        <SideBar
          users={users}
          inGame={false}
          refetchMe={refetchMe}
          showUsers={showUsers}
          showHost={showHost}
          games={games}
        />
        <Chat me={me} />
      </div>
      <footer></footer>
    </div>
  );
};
