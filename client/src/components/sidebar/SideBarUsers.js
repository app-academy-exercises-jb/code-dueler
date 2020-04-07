import React from "react";

const SideBarUsers = ({ data, loading, error }) => {
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not Found</p>;
  if (!data.users) return <p>Users not found</p>;

  let users = data.users;
  let userList = users.map((user) => (
    <li key={user._id} className="user-list-item">
      {user.username}
    </li>
  ));

  return <ul className="user-list">{userList}</ul>;
};

export default SideBarUsers;
