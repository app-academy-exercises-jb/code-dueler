import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_ONLINE_USERS } from "../../graphql/queries";

const NavBarPlayerCount = (props) => {
  const { data } = useQuery(GET_ONLINE_USERS);
  let usersCount;
  if (!data) {
    usersCount = 0;
  } else {
    usersCount = data.users ? data.users.length : 0;
  }
  return <>{usersCount} users ready to duel</>;
};

export default NavBarPlayerCount;
