import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { ADD_MESSAGE } from "../../graphql/mutations";

const PlayerTextEditor = ({ me }) => {
  const [addMessage] = useMutation(ADD_MESSAGE);
  const [chatInput, setChatInput] = useState("");
  const handleChatSubmit = (e) => {
    e.preventDefault();
    addMessage({ variables: { author: me._id, body: chatInput } });
    setChatInput("");
  };
  return (
    <div className="playertext-editor-wrapper">
      <form onSubmit={handleChatSubmit} className="playertext-editor-form">
        <input
        placeholder="ENTER TEXT HERE"
          autoFocus
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="playertext-input-area"
        />
      </form>
    </div>
  );
};

export default PlayerTextEditor;
