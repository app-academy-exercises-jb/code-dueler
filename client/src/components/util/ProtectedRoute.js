import React, { useEffect, useRef } from "react";
import { Route, Redirect } from "react-router-dom";
import { useQuery, useApolloClient, useLazyQuery } from "@apollo/react-hooks";
import {
  CURRENT_USER,
  IS_LOGGED_IN,
  GET_ONLINE_USERS,
  GET_ONLINE_GAMES,
} from "../../graphql/queries";
import { 
  USER_LOGGED_EVENT,
  GAME_LOGGED_EVENT, 
} from "../../graphql/subscriptions";

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

      if (user._id === me._id) {
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
          client.clearStore().then(() => {
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

  const subscribedToUsers = useRef(false);

  const [
    loadMe,
    { 
      refetch: refetchMe,
      ...me
    }
  ] = useLazyQuery(CURRENT_USER, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [loadUsers, { subscribeToMore: subscribeToUsers, ...onlineUsers }] = useLazyQuery(GET_ONLINE_USERS, {
    fetchPolicy: "network-only",
  });
  
  const [loadGames, { subscribeToMore: subscribeToGames, ...games }] = useLazyQuery(GET_ONLINE_GAMES, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (!data || !data.isLoggedIn) return;

    if (me.called === false) {
      loadMe();
      loadGames();
      loadUsers();
    } 
    
    if (me.loading === false
        && me.called === true
        && onlineUsers.loading === false
        && subscribedToUsers.current === false) {
      subscribeToUserEvents(subscribeToUsers, me, client, refetchMe, refetchMeLogged);
      subscribeToGames({
        document: GAME_LOGGED_EVENT,
        updateQuery: (prev, { subscriptionData }) => {
          const { gameLoggedEvent: game } = subscriptionData.data,
            next = { games: Object.assign([], prev.games) },
            idx = next.games.findIndex((g) => g._id === game._id);

          if (idx === -1 && game.status !== "over") {
            // if we have a brand new game, splice it in
            next.games.splice(0, 0, game);
          } else {
            if (game.status === "over") {
              next.games.splice(idx, 1);
            } else {
              next.games.splice(idx, 1, game);
            }
          }
            
          return next;
        }
      });
      subscribedToUsers.current = true;
    }
  }, [data, onlineUsers.loading, me.loading, me.called, subscribedToUsers]);

  if (!redirectTo) redirectTo = "/welcome";
  if (loading || error || !data || 
      (data.isLoggedIn && 
        (!me.called || (me.called && !me.data)))) {
    return null;
  } else if (data.isLoggedIn) {
    if (!onlineUsers.data || onlineUsers.error
        || !games.data || games.error) return null;
    
    return (
      <Route
        path={path}
        {...rest}
        render={() => {
          return (
            <Component
              games={games.data.games}
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
