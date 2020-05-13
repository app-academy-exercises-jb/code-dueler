import React from "react";
import GreenCo from "../../images/green-co.png";
import RedCo from "../../images/red-co.png";
import YellowCo from "../../images/yellow-co.png";
import PinkCo from "../../images/pink-co.png";
import ToolTip from "../util/ToolTip";

const UserStatusIcon = ({user, inGame}) => {
  if (inGame) {
    return (
      <div>
        <img className="status-icon" src={PinkCo} />
      </div>
    );
  } else {
    if (user.inGame === false) {
      return (
        <div>
          <ToolTip content={`${user.username} is ready for a duel!`}>
            <img className="status-icon" src={GreenCo} />
          </ToolTip>
        </div>
      );
    } else if (user.inLobby === true) {
      return (
        <div>
          <ToolTip content={`${user.username} is preparing for a duel!`}>
            <img className="status-icon" src={YellowCo} />
          </ToolTip>
        </div>
      );
    } else if (user.inGame === true) {
      return (
        <div>
          <ToolTip content={`${user.username} is in a duel!`}>
            <img className="status-icon" src={RedCo} />
          </ToolTip>
        </div>
      );
    }
  }
}

export default UserStatusIcon;