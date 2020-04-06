import React, { useState } from "react";

const ChatTextEditor = (props) => {
  const [chatInput, setChatInput] = useState("");
  const handleChatSubmit = (e) => {
    e.preventDefault();
    // do something with the input
    // console.log("chat: " + chatInput);
    setChatInput("");
  };
  return (
    <div className="text-editor-wrapper">
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
