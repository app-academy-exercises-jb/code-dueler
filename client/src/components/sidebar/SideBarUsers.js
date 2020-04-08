import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { INVITE_PLAYER } from "../../graphql/mutations";

const SideBarUsers = ({ data, loading, error }) => {
  const [invitePlayer] = useMutation(INVITE_PLAYER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not Found</p>;
  if (!data.users) return <p>Users not found</p>;

  let users = data.users;
  let userList = users.map((user) => (
    <li
      onClick={() => invitePlayer({ variables: { invitee: user._id } })}
      key={user._id}
      className="user-list-item"
    >
      {user.username}
    </li>
  ));

  return <ul className="user-list">{userList}</ul>;
};

export default SideBarUsers;
