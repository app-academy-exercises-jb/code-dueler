import React from "react";
import SideBar from "../sidebar/SideBar";
import ChatMain from "../chat/ChatMain";

const GlobalMain = ({ data }) => {
  return (
    <div className="global-main">
      <SideBar data={data} />
      <ChatMain />
    </div>
  );
};

export default GlobalMain;
