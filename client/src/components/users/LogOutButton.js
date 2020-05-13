import React from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { LOGOUT_USER } from "../../graphql/mutations";
import { useHistory } from "react-router-dom";

export default ({ refetchMe }) => {
  const client = useApolloClient();
  const [logout] = useMutation(LOGOUT_USER);
  const history = useHistory();

  return (
    <div
      className="button-nav"
      onClick={async () => {
        const {
          data: { logout: ok },
        } = await logout();
        if (ok === "ok") {
          history.push("/");
          client.clearStore().then(() => {
            client.subscriptionClient.unsubscribeAll();
            client.subscriptionClient.close();
            refetchMe();
          });
        }
      }}
    >
      <button className="logout-button">Log Out</button>
    </div>
  );
};
