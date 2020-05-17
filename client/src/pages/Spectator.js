import React, { useState } from "react";
import Spectator from "../components/spectator/Spectator";
import NavBar from "../components/nav/NavBar";

export default ({ ...props }) => {
  const [spectators, setSpectators] = useState(null);

  return (
    <div className="global">
      <NavBar data={spectators && spectators - 2} inGame={true} refetchMeLogged={props.refetchMeLogged} />
      <div className="main">
        <Spectator {...props} setSpectators={setSpectators} />
      </div>
      <footer></footer>
    </div>
  );
};
