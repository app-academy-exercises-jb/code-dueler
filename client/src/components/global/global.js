import React from "react";
import SideBar from "../sidebar/SideBar";
import Chat from "../chat/Chat";

const GlobalMain = ({ data, me }) => {
  return (
    <div className="global-main">
      <SideBar data={data} />
      <Chat me={me} />
    </div>
  );
};

export default GlobalMain;
