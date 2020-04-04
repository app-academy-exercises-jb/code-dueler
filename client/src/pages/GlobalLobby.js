import React from "react";
import NavBar from "../components/nav/NavBar.js";
import UserDetails from "../components/users/UserDetails.js";
import LogOutButton from "../components/users/LogOutButton.js";

export default () => {
  return (
    <div className="main">
      <NavBar />
      <UserDetails />
    </div>
  );
};
