import React from "react";
import SideBar from "../sidebar/SideBar";
import Chat from "../chat/Chat";

const GlobalMain = ({ data }) => {
  return (
    <div className="global-main">
      <SideBar data={data} />
      <Chat />
    </div>
  );
};

export default GlobalMain;
