import React from "react";
import { useApolloClient } from "@apollo/react-hooks";

export default () => {
  const client = useApolloClient();
  return (
    <div
      className="logout-nav"
      onClick={() => {
        client.resetStore();
      }}
    >
      <button className="logout-button">Log Out</button>
    </div>
  );
};
