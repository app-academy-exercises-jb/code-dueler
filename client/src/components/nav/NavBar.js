import React from "react";
import LogOutButton from "../users/LogOutButton";
import { Link } from "react-router-dom";
import ProtectedComponent from "../util/ProtectedComponent";
import { useQuery } from "@apollo/react-hooks";
import { GET_ONLINE_USERS } from "../../graphql/queries";

const NavBar = (props) => {
  const { data } = useQuery(GET_ONLINE_USERS);
  let usersCount;
  if (!data) {
    usersCount = null;
  } else {
    usersCount = data.users ? data.users.length : null;
  }
  return (
    <>
      <div className="nav-bar-wrapper">
        <div className="left-nav">{usersCount} users ready to duel</div>
        <div className="logo-wrapper">
          <Link to="/" className="logo-nav">
            CodeDueler
          </Link>
        </div>
        <div>
          <ProtectedComponent component={LogOutButton} />
        </div>
      </div>
      <div className="spacer">&nbsp;</div>
    </>
  );
};

export default NavBar;
