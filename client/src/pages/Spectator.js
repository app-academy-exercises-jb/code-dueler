import React, { useState } from "react";
import Spectator from "../components/spectator/Spectator";
import NavBar from "../components/nav/NavBar";

export default ({ ...props }) => {
  const [spectators, setSpectators] = useState(null);

  return (
    <>
      <NavBar data={spectators && spectators - 2} inGame={true} />
      <Spectator {...props} setSpectators={setSpectators} />
    </>
  );
};
