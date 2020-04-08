import React, { useEffect } from "react";
import NavBar from "../nav/NavBar";
import GlobalMain from "./global";
import { GET_ONLINE_USERS } from "../../graphql/queries";
import { USER_LOGGED_EVENT, ON_INVITATION } from "../../graphql/subscriptions";
import { useQuery, useSubscription } from "@apollo/react-hooks";

const subscribeToUserEvents = (subscribeToMore) => (
  subscribeToMore({
    document: USER_LOGGED_EVENT,
    updateQuery: (prev, { subscriptionData }) => {
      const {
        user
      } = subscriptionData.data.userLoggedEvent,
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
  })
);

const Lobby = ({ data, loading, error, subscribeToUserEvents,  }) => {
  useSubscription(ON_INVITATION, {
    fetchPolicy: "network-only",
    variables: { test:"test" },
    onSubscriptionData: data => {
      alert()
    },
  });
  
  useEffect(() => {
    setTimeout(() => {
      subscribeToUserEvents();
    }, 10);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not Found</p>;
  if (!data.users) return <p>Users not found</p>;

  return (
    <>
      <NavBar data={data} />
      <GlobalMain data={data} />
    </>
  );
}

export default () => {
  const { subscribeToMore, ...result } = useQuery(GET_ONLINE_USERS, {
    fetchPolicy: "network-only",
  });

  return (
    <div className="main">
      <Lobby
        {...result}
        subscribeToUserEvents={subscribeToUserEvents(subscribeToMore)}
      />
    </div>
  );
};
