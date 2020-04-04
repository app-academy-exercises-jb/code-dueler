import React from "react";
import NavBar from "../components/nav/NavBar.js";
import UserDetails from "../components/users/UserDetails.js";
import SideBar from "../components/sidebar/SideBar.js";

export default () => {
  return (
    <div className="main">
      <NavBar />
      <SideBar />
      <UserDetails />
    </div>
  );
};
