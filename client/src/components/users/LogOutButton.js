import React from "react";
import { useApolloClient } from "@apollo/react-hooks";


export default () => {
  const client = useApolloClient();
  return (
    <div className="logout-nav">
      <button
        className="logout-button"
        onClick={() => {
          client.resetStore();
        }}
      >
        LOG OUT
      </button>
    </div>
  );
};
