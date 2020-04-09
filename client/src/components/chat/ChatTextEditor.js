import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { ADD_MESSAGE } from "../../graphql/mutations";

const ChatTextEditor = ({ me, channelId, id }) => {
  const [addMessage] = useMutation(ADD_MESSAGE);
  const [chatInput, setChatInput] = useState("");
  const handleChatSubmit = (e) => {
    e.preventDefault();
    addMessage({ variables: { author: me._id, body: chatInput, channelId } });
    setChatInput("");
  };
  return (
    <div className="text-editor-wrapper" id={id}>
      <form onSubmit={handleChatSubmit} className="text-editor-form">
        <input
          autoFocus
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="text-input-area"
        />
      </form>
    </div>
  );
};

export default ChatTextEditor;
