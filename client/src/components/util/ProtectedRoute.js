import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import {
  CURRENT_USER,
  IS_LOGGED_IN,
  GET_ONLINE_USERS,
} from "../../graphql/queries";
import { USER_LOGGED_EVENT } from "../../graphql/subscriptions";

const subscribeToUserEvents = (
  subscribeToMore,
  { 
    data: { me },
    networkStatus,
  },
  client,
  refetchMe,
  refetchMeLogged
) =>
  subscribeToMore({
    document: USER_LOGGED_EVENT,
    updateQuery: (prev, { subscriptionData }) => {
      const { user } = subscriptionData.data.userLoggedEvent,
        next = { users: Object.assign([], prev.users) },
        idx = next.users.findIndex((u) => u._id === user._id);

      if (user._id === me._id
        && user.inGame === false
        && user.loggedIn === true
        && networkStatus !== 4) {
          refetchMe();
      }

      if (user.loggedIn === true && idx === -1) {
        // if we have a brand new user, splice them in
        next.users.splice(0, 0, user);
      } else if (user.loggedIn === false) {
        if (idx === -1) return next;
        if (me._id === next.users[idx]._id) {
          client.subscriptionClient.unsubscribeAll();
          client.subscriptionClient.close();
          client.clearStore()
            .then(() => {
              refetchMeLogged();
            });
        }
        next.users.splice(idx, 1);
      }

      return next;
    },
  });

export default ({ component: Component, path, redirectTo, ...rest }) => {
  const client = useApolloClient();
  const { refetch: refetchMeLogged, data, loading, error } = useQuery(IS_LOGGED_IN);

  const { refetch: refetchMe, ...me } = useQuery(CURRENT_USER, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const { subscribeToMore, ...onlineUsers } = useQuery(GET_ONLINE_USERS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data && data.isLoggedIn && onlineUsers.loading === false && me.loading === false) {
      setTimeout(() => {
        subscribeToUserEvents(subscribeToMore, me, client, refetchMe, refetchMeLogged);
      }, 10);
    }
  }, [data, onlineUsers.loading, me.loading]);

  if (!redirectTo) redirectTo = "/login";
  if (loading || error || !data || !me.data) {
    return null;
  } else if (data.isLoggedIn) {
    if (!onlineUsers.data || onlineUsers.error) return null;
    
    return (
      <Route
        path={path}
        {...rest}
        render={() => {
          return (
            <Component
              users={onlineUsers.data.users}
              me={{networkStatus: me.networkStatus, ...me.data.me}}
              refetchMeLogged={refetchMeLogged}
              refetchMe={refetchMe}
            />
          );
        }}
      />
    );
  } else {

    return (
      <Route
        path={path}
        render={() => <Redirect to={redirectTo} />}
        {...rest}
      />
    );
  }
};
