import React from "react";
import NavBar from "../components/nav/NavBar";
import SideBar from "../components/sidebar/SideBar";
import ChatBox from "../components/chat/ChatBox";


export default () => {
  return (
    <div className="main">
      <NavBar />
      <SideBar />
      <ChatBox />
    </div>
  );
};
