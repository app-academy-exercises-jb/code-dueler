import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { IS_LOGGED_IN, GET_ONLINE_USERS } from "../../graphql/queries";
import { USER_LOGGED_EVENT, ON_INVITATION } from "../../graphql/subscriptions";

const subscribeToUserEvents = (subscribeToMore) =>
  subscribeToMore({
    document: USER_LOGGED_EVENT,
    updateQuery: (prev, { subscriptionData }) => {
      const { user } = subscriptionData.data.userLoggedEvent,
        next = { users: Object.assign([], prev.users) },
        idx = next.users.findIndex((u) => u._id === user._id);

      if (user.loggedIn === true && idx === -1) {
        // if we have a brand new user, splice them in
        next.users.splice(0, 0, user);
      } else if (user.loggedIn === false) {
        if (idx === -1) return next;
        next.users.splice(idx, 1);
      }

      return next;
    },
  });

export default ({ component: Component, path, redirectTo, ...rest }) => {
  const { data, loading, error } = useQuery(IS_LOGGED_IN);
  const { subscribeToMore, ...onlineUsers } = useQuery(GET_ONLINE_USERS, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (data && data.isLoggedIn && onlineUsers.loading === false) {
      setTimeout(() => {
        subscribeToUserEvents(subscribeToMore);
      }, 10);
    }
  }, [data, onlineUsers.loading]);

  if (!redirectTo) redirectTo = "/login";
  if (loading || error || !data) {
    return null;
  } else if (data.isLoggedIn) {
    return <Route path={path} {...rest} render={() => {
      return <Component onlineUsers={onlineUsers} />
    }} />;
  } else {
    return <Route path={path} render={() => <Redirect to={redirectTo} />} {...rest}/>;
  }
};
