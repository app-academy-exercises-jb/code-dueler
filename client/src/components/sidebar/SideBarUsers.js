import React from "react";
import UserStatusIcon from "./UserStatusIcon";
import ToolTip from "../util/ToolTip";


const SideBarUsers = ({ users, inGame, action, playersSection, me, gameSelfStatus }) => {
  const handleReady = (e, user) => {
    if (user._id !== me._id
      || gameSelfStatus === 'host') return e.preventDefault();
    debugger

  };

  const CheckBox = ({idx, user}) => {
    let checked = false;
    if (idx === 0) checked = true;

    return (
      <input 
        type='checkbox'
        className='user-ready-checkmark'
        checked={checked}
        onChange={e => handleReady(e, user)}
      >
      </input>
    )};

  let userList = users.map((user, idx) => (
    <li
      onClick={() => action(user)}
      key={user._id}
      className={`${(!inGame && (user.inGame || user.inLobby)) ? 'pointer ' : ''}user-list-item`}
    >
      <div>
        {!inGame &&
          <UserStatusIcon user={user} />
        }
        {inGame && 
          <UserStatusIcon playersSection={playersSection} idx={idx} inGame={true} user={user} />
        }
        <p>{user.username}</p>
      </div>
      {playersSection &&
        (gameSelfStatus === 'host' && idx === 0
          ? <ToolTip content="The host is always ready..." positionClass='checkbox-tooltip'>
              <CheckBox idx={idx} user={user}/>
            </ToolTip>
          : <CheckBox idx={idx} user={user}/>)
      }
    </li>
  ));

  return <ul className="user-list">{userList}</ul>;
};

export default SideBarUsers;
