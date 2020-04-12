import React from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { LOGOUT_USER } from "../../graphql/mutations";

export default () => {
  const client = useApolloClient();
  const [logout] = useMutation(LOGOUT_USER);

  return (
    <div
      className="logout-nav"
      onClick={async () => {
        const { data: { logout: ok }} = await logout();
        if (ok === "ok") {
          client.subscriptionClient.unsubscribeAll();
          client.subscriptionClient.close();
          client.resetStore();
        }
      }}
    >
      <button className="logout-button">Log Out</button>
    </div>
  );
};
