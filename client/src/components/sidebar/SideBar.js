import React from "react";


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
