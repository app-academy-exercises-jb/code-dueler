import React from "react";
import SideBarUsers from "./SideBarUsers";
import { GET_ONLINE_USERS } from "../../graphql/queries";
import { USER_LOGGED_EVENT } from "../../graphql/subscriptions";
import { useQuery } from "@apollo/react-hooks";
import UserDetails from "../users/UserDetails";

const SideBar = (props) => {
  const { subscribeToMore, ...result} = useQuery(GET_ONLINE_USERS);
  
  return (
    <div className="sidebar-wrapper">
      <UserDetails />
      <div className="user-list-wrapper">
        <SideBarUsers
          {...result}
          subscribeToUserEvents={()=>
            subscribeToMore({
              document: USER_LOGGED_EVENT,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                const { user, loggedIn} = subscriptionData.data.userLoggedEvent;
                const next = { users: [...prev.users] };

                if (loggedIn === true) {
                  next.users.splice(0, 0, user);
                } else {
                  const idx = next.users.findIndex(u => u._id === user._id)
                  if (idx === -1) return prev;
                  next.users.splice(idx, 1);
                }

                return next;
              }
            })
          }
        />
      </div>
    </div>
  );
};

export default SideBar;
