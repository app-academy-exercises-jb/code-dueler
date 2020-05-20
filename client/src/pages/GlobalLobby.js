import React, { useState } from "react";
import NavBar from "../components/nav/NavBar";
import SideBar from "../components/sidebar/SideBar";
import Chat from "../components/chat/Chat";

export default ({users, games, me, refetchMe, refetchMeLogged}) => {
  const [showUsers, setShowUsers] = useState(true);

  return (
    <div className="global">
      <NavBar
        userCount={showUsers ? users.length : games.length}
        refetchMeLogged={refetchMeLogged}
        inLobby={true}
        refetchMe={refetchMe}
        setShowUsers={setShowUsers}
        showUsers={showUsers}
      />
      <div className="main">
        <SideBar
          users={users}
          inGame={false}
          refetchMe={refetchMe}
          showUsers={showUsers}
          games={games}
        />
        <Chat me={me} />
      </div>
      <footer></footer>
    </div>
  );
};
