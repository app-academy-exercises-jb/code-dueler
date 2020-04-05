import React from "react";
import SideBarUsers from "./SideBarUsers";

const SideBar = (props) => {
  return (
    <div className="sidebar-wrapper">
      <div className="user-list-wrapper">
        <SideBarUsers />
        <SideBarUsers />
        <SideBarUsers />
        <SideBarUsers />
        <SideBarUsers />
      </div>
    </div>
  );
};

export default SideBar;
