import React from "react";
import SideBarUsers from "./SideBarUsers";
import { GET_ONLINE_USERS } from "../../graphql/queries";
import { USER_LOGGED_EVENT } from "../../graphql/subscriptions";
import { useQuery, useSubscription } from "@apollo/react-hooks";

const SideBar = (props) => {
  // debugger
  const { subscribeToMore, ...result } = useQuery(GET_ONLINE_USERS, {
    fetchPolicy: "network-only",
  });


  // const { data, loading } = useSubscription(USER_LOGGED_EVENT, {
  //   onSubscriptionData: (client, data) => {
  //     console.log({data});
  //   }
  // });

  return (
    <div className="sidebar-wrapper">
      <div className="user-list-wrapper">
        <SideBarUsers
          {...result}
          subscribeToUserEvents={() =>
            subscribeToMore({
              document: USER_LOGGED_EVENT,
              updateQuery: (prev, { subscriptionData }) => {
                // console.log({prev});
                // console.log({data})
                // return prev;
                // if (!subscriptionData) return prev;
                debugger
                const {
                  user,
                  loggedIn,
                } = subscriptionData.data.userLoggedEvent,
                  next = { users: Object.assign([], prev.users) },
                  idx = next.users.findIndex((u) => u._id === user._id);

                if (loggedIn === true && idx === -1) {
                  // if we have a brand new user, splice them in
                  next.users.splice(0, 0, user);
                } else if (loggedIn === false) {
                  if (idx === -1) return next;

                  next.users.splice(idx, 1);
                }

                console.log("next:", next)
                
                return next;
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default SideBar;
