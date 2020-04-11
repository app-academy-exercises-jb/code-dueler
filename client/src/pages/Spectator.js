import React from "react";
import Spectator from "../components/spectator/Spectator";
import NavBar from "../components/nav/NavBar";

export default ({ me }) => {
  return (
    <>
      <NavBar />
      <Spectator me={me} />
    </>
  );
};
