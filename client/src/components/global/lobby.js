import React from "react";
import NavBar from "../nav/NavBar";
import GlobalMain from "./global";


export default ({ onlineUsers: {data, loading, error}, me, refetchMe }) => {

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not Found</p>;
  if (!data.users) return <p>Users not found</p>;
  
  return (
    <>
      <NavBar data={data} refetchMe={refetchMe} />
      <GlobalMain data={data} me={me} />
    </>
  );
};
