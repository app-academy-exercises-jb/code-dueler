import React from "react";
import SideBar from "../sidebar/SideBar";
import ChatMain from "../chat/ChatMain";

const GlobalMain = (props) => {
  return (
    <div className="global-main">
      <SideBar />
      <ChatMain />
    </div>
  );
};

export default GlobalMain;
