import React from "react";
import GreenCo from "../../images/green-co.png";
import RedCo from "../../images/red-co.png";
import YellowCo from "../../images/yellow-co.png";
import PinkCo from "../../images/pink-co.png";
import ToolTip from "../util/ToolTip";
import P1 from "../../images/p1.png";
import P2 from "../../images/p2.png";

const UserStatusIcon = ({user, inGame, playersSection, idx}) => {
  if (inGame) {
    let players = [P1, P2];
    return (
      <div>
        <img
          className="status-icon"
          src={playersSection ? players[idx] : PinkCo}
          alt={playersSection ? players[idx].toString() : "S"} />
      </div>
    );
  } else {
    if (user.inLobby === true) {
      return (
        <div>
          <ToolTip content={`${user.username} is in a duel lobby!`}>
            <img className="status-icon" src={YellowCo} alt="Y" />
          </ToolTip>
        </div>
      );
    } else if (user.inGame === false) {
      return (
        <div>
          <ToolTip content={`${user.username} is ready for a duel!`}>
            <img className="status-icon" src={GreenCo} alt="G" />
          </ToolTip>
        </div>
      );
    } else if (user.inGame === true) {
      return (
        <div>
          <ToolTip content={`${user.username} is in a duel!`}>
            <img className="status-icon" src={RedCo} alt="R" />
          </ToolTip>
        </div>
      );
    }
  }
}

export default UserStatusIcon;