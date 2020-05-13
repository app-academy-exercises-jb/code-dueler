import React from "react";
import LogOutButton from "../users/LogOutButton";
import { Link } from "react-router-dom";
import ProtectedComponent from "../util/ProtectedComponent";
import NavBarPlayerCount from "./NavBarPlayerCount";
import Credits from "../credits/Credits";

const NavBar = ({ data, noData, inGame, refetchMe }) => {
  return (
    <>
      <div className="nav-bar-wrapper">
        <div className="left-nav">
          {!noData && (
            <ProtectedComponent
              component={NavBarPlayerCount}
              data={data}
              inGame={inGame}
            />
          )}
        </div>
        <div className="other-left">&nbsp;</div>
        <div className="logo-wrapper">
          <Link to="/" className="logo-nav">
            CodeDueler
          </Link>
        </div>
        <div className="nav-right">
          <Link className="button-nav" to="/credits">
            Credits
          </Link>
          <ProtectedComponent component={LogOutButton} refetchMe={refetchMe} />
        </div>
      </div>
      <div className="nav-bar-spacer"></div>
    </>
  );
};

export default NavBar;
