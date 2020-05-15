import React from "react";

const ChatMessageItem = ({ message }) => {
  const date = new Date(message.createdAt).toLocaleString();
  return (
    <li key={message._id} className="chat-item">
      <div className="chat-message-info">
        <p className="chat-username">{message.author.username}</p>
        <p className="chat-date">{date}</p>
      </div>
      <p className="chat-body">{message.body}</p>
    </li>
  );
};

export default ChatMessageItem;
