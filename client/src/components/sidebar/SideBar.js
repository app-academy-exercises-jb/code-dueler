import React from "react";
import SideBarUsers from "./SideBarUsers";
import { GET_ONLINE_USERS } from "../../graphql/queries";
import { USER_LOGGED_EVENT } from "../../graphql/subscriptions";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

const SideBar = (props) => {
  const { subscribeToMore, ...result } = useQuery(GET_ONLINE_USERS);

  return (
    <div className="sidebar-wrapper">
      <div className="user-list-wrapper">
        <SideBarUsers
          {...result}
          subscribeToUserEvents={() =>
            subscribeToMore({
              document: USER_LOGGED_EVENT,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;

                const {
                    user,
                    loggedIn,
                  } = subscriptionData.data.userLoggedEvent,
                  next = { users: [...prev.users] },
                  idx = next.users.findIndex((u) => u._id === user._id);

                if (loggedIn === true && idx === -1) {
                  next.users.splice(0, 0, user);
                } else if (loggedIn === false) {
                  if (idx === -1) return prev;
                  next.users.splice(idx, 1);
                }

                return next;
              },
            })
          }
        />
        <Link to="/playerscreen" className="logo-nav">
          challenge this player
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
