import React from "react";

const NavBarPlayerCount = ({ data }) => {
  let usersCount;

  if (!data) {
    usersCount = 0;
  } else {
    usersCount = data.users ? data.users.length : 0;
  }

  return <>{usersCount} users ready to duel</>;
};

export default NavBarPlayerCount;
