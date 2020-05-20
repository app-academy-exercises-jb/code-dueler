import React from "react";
import UserStatusIcon from "./UserStatusIcon";
import ToolTip from "../util/ToolTip";
import { 
  UPDATE_GAME_USER_STATUS,
  KICK_PLAYER,
} from "../../graphql/mutations";
import { useMutation } from "@apollo/react-hooks";
import KickPlayer from "../../images/cancel.png"

const SideBarUsers = ({
  users,
  inGame,
  action,
  playersSection,
  me,
  gameSelfStatus,
  gameId
 }) => {
  const [updateUserStatus] = useMutation(UPDATE_GAME_USER_STATUS);
  const [kickPlayer] = useMutation(KICK_PLAYER);

  const handleReady = (e, user, ready) => {
    if (user._id !== me._id
      || gameSelfStatus === 'host') return e.preventDefault();

    updateUserStatus({ variables: {
      player: user._id,
      ready,
      gameId,
    }});
  };

  const handleKickPlayer = player => {
    kickPlayer({variables: {
      player,
      action: 'boot'
    }});
  };

  const CheckBox = ({user}) => {
    let checked = user.ready;

    return (
      <label 
        className="checkmark-container"
        onClick={e => handleReady(e, user, !checked)}
      >
        <input 
          type='checkbox'
          className='user-ready-checkbox'
          checked={checked}
          readOnly={true}
        >
        </input>
        <span className='user-ready-checkmark'></span>
      </label>
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
        {inGame && (gameSelfStatus === 'host' && user._id !== me._id
          ? <div className='cancellable' onClick={() => handleKickPlayer(user._id)}>
              <ToolTip content="Kick player" positionClass='kick-tooltip'>
                <UserStatusIcon
                  playersSection={playersSection}
                  idx={idx}
                  inGame={true}
                  user={user} />
                <img src={KickPlayer} alt=""/>
              </ToolTip>
            </div>
          : <UserStatusIcon playersSection={playersSection} idx={idx} inGame={true} user={user} />
        )}
        <p>{user.username}</p>
      </div>
      {playersSection &&
        (gameSelfStatus === 'host' && idx === 0
          ? <ToolTip content="The host is always ready..." positionClass='checkbox-tooltip'>
              <CheckBox idx={idx} user={user}/>
            </ToolTip>
          : user._id === me._id
            ? <ToolTip
            content={`Declare self ${user.ready ? 'not ready' : 'ready'}`}
            positionClass='checkbox-tooltip'
            >
              <CheckBox idx={idx} user={user}/>
            </ToolTip>
            : <CheckBox idx={idx} user={user}/>
        )
      }
    </li>
  ));

  return <ul className="user-list">{userList}</ul>;
};

export default SideBarUsers;
