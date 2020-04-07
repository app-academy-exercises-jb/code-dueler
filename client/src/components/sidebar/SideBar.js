import React from "react";
import SideBarUsers from "./SideBarUsers";

const SideBar = ({ data }) => {
  return (
    <div className="sidebar-wrapper">
      <div className="user-list-wrapper">
        <SideBarUsers data={data} />
      </div>
    </div>
  );
};

export default SideBar;
