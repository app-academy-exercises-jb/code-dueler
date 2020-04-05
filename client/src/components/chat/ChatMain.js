import React from "react";
import ChatView from "./ChatView";
import ChatTextEditor from "./ChatTextEditor";

const ChatMain = (props) => {
  return (
    <div className="chat-main">
      <ChatView />
      <ChatTextEditor />
    </div>
  );
};

export default ChatMain;
