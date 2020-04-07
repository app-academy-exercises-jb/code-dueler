import React from "react";
import ChatView from "../chat/ChatView";
import ChatTextEditor from "../chat/ChatTextEditor";
import { useQuery } from "@apollo/react-hooks";
import { CURRENT_USER } from "../../graphql/queries";

const ChatMain = (props) => {
  const { data, loading, error } = useQuery(CURRENT_USER, {
    fetchPolicy: "network-only",
  });

  if (error) console.log(error);
  if (loading || error) return null;

  const me = data.me;

  return (
    <div className="chat-player">
      <ChatView />
      <ChatTextEditor me={me} />
    </div>
  );
};

export default ChatMain;
