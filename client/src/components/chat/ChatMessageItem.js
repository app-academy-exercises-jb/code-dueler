import React from "react";

const ChatMessageItem = ({ message }) => {
  date = message.createdAt.toLocaleString();
  return (
    <li key={message._id} className="chat-item">
      <p>{date}</p>
      <p>{message.author.username}</p>
      <p>{message.body}</p>
    </li>
  );
};

export default ChatMessageItem;
