import React from "react";
import UserStatusIcon from "./UserStatusIcon";


const SideBarUsers = ({ users, inGame, action, playersSection }) => {
  let userList = users.map((user, idx) => (
    <li
      onClick={() => action(user)}
      key={user._id}
      className={`${(!inGame && (user.inGame || user.inLobby)) ? 'pointer ' : ''}user-list-item`}
    >
      {!inGame &&
        <UserStatusIcon user={user} />
      }
      {inGame && 
        <UserStatusIcon playersSection={playersSection} idx={idx} inGame={true} user={user} />
      }
      {user.username}
    </li>
  ));

  return <ul className="user-list">{userList}</ul>;
};

export default SideBarUsers;
