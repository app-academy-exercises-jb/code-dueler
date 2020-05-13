import React from "react";
import NavBar from "../components/nav/NavBar";
import SideBar from "../components/sidebar/SideBar";
import Chat from "../components/chat/Chat";

export default ({users, me, refetchMe}) => {
  return (
    <div className="global">
      <NavBar userCount={users.length} refetchMe={refetchMe} inLobby={true} />
      <div className="main">
        <SideBar
          users={users}
          inGame={false}
        />
        <Chat me={me} />
      </div>
      <footer></footer>
    </div>
  );
};
