import React from "react";
import GameScreen from "../../pages/GameScreen";
import Spectator from "../../pages/Spectator";
import { useLocation } from "react-router-dom";
import queryString from 'query-string';

export default ({ ...props }) => {
  const location = useLocation();
  const parsed = queryString.parse(location.search);

  if (parsed.spectate === "true") {
    return <Spectator { ...props } />
  } else {
    return <GameScreen { ...props } />
  }
};
