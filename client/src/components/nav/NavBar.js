import React from "react";
import LogOutButton from "../users/LogOutButton";
import { Link } from "react-router-dom";

const NavBar = (props) => {
  return (
    <div className="nav-bar-wrapper">
      <div className="left-nav"></div>
      <div className="logo-wrapper">
        <Link to="/" className="logo-nav">
          CodeDueler
        </Link>
      </div>
      <div className="logout-nav">
        <LogOutButton />
      </div>
    </div>
  );
};

export default NavBar;
