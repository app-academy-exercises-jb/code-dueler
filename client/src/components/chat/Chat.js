import React from "react";
import ChatView from "./ChatView";
import ChatTextEditor from "./ChatTextEditor";
import { useQuery } from "@apollo/react-hooks";
import { CURRENT_USER } from "../../graphql/queries";

const Chat = ({ channelId, id }) => {
  const { data, loading, error } = useQuery(CURRENT_USER, {
    fetchPolicy: "network-only",
  });

  if (loading || error) return null;

  const me = data.me;

  if (!channelId) channelId = "global";

  return (
    <div className="chat-main">
      <ChatView channelId={channelId} />
      <ChatTextEditor channelId={channelId} id={id} me={me} />
    </div>
  );
};

export default Chat;
