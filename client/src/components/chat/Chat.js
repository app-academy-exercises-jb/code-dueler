import React from "react";
import ChatView from "./ChatView";
import ChatTextEditor from "./ChatTextEditor";

const Chat = ({ channelId, id, me: {data, loading, error} }) => {
  if (loading || error || !data) return null;
  if (!channelId) channelId = "global";

  return (
    <div className="chat-main">
      <ChatView channelId={channelId} />
      <ChatTextEditor channelId={channelId} id={id} me={data.me} />
    </div>
  );
};

export default Chat;
