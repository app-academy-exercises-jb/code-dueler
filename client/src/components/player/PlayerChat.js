import React from "react";
import PlayerView from "./PlayerView";
import PlayerTextEditor from "./PlayerTextEditor";
import { CURRENT_USER } from "../../graphql/queries";
import { useQuery } from "@apollo/react-hooks";


const PlayerMain = (props) => {
  const { data, loading, error } = useQuery(CURRENT_USER, {
    fetchPolicy: "network-only",
  });

  if (error) console.log(error);
  if (loading || error) return null;

  const me = data.me;

  return (
    <div className="player-main">
      <PlayerView />
      <PlayerTextEditor me={me} />
    </div>
  );
};

export default PlayerMain;
