import React from "react";
import NavBar from "../components/nav/NavBar";
import SideBar from "../components/sidebar/SideBar";
import Chat from "../components/chat/Chat";

export default ({users, me, refetchMe, refetchMeLogged}) => {
  return (
    <div className="global">
      <NavBar
        userCount={users.length}
        refetchMeLogged={refetchMeLogged}
        inLobby={true}
        refetchMe={refetchMe}
      />
      <div className="main">
        <SideBar
          users={users}
          inGame={false}
          refetchMe={refetchMe}
        />
        <Chat me={me} />
      </div>
      <footer></footer>
    </div>
  );
};
