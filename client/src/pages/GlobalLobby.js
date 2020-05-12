import React from "react";
import NavBar from "../components/nav/NavBar";
import SideBar from "../components/sidebar/SideBar";
import Chat from "../components/chat/Chat";
import LobbyTour from "../components/tour/LobbyTour";

export default ({ onlineUsers: { data }, me, refetchMe }) => {
  return (
    <div className="global">
      <LobbyTour />
      <NavBar data={data} refetchMe={refetchMe} />
      <div className="main">
        <SideBar data={data} />
        <Chat me={me} />
      </div>
      <footer></footer>
    </div>
  );
};
