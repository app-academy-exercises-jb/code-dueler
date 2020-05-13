import React from "react";
import UserStatusIcon from "./UserStatusIcon";


const SideBarUsers = ({ users, inGame, action }) => {
  let userList = users.map((user, idx) => (
    <li
      onClick={() => action(user)}
      key={user._id}
      className="user-list-item"
    >
      {!inGame &&
        <UserStatusIcon user={user} />
      }
      {inGame && 
        <UserStatusIcon inGame={true} user={user} />
      }
      {user.username}
    </li>
  ));

  return <ul className="user-list">{userList}</ul>;
};

export default SideBarUsers;
