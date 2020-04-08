import React from "react";

const PlayerMessageItem = ({ message }) => {
  const date = new Date(message.createdAt).toLocaleTimeString();
  return (
    <li key={message._id} className="player-item">
      <div className="player-message-info">
        <p className="playre-username">{message.author.username}</p>
        <p className="player-date">{date}</p>
      </div>
      <p className="player-body">{message.body}</p>
    </li>
  );
};

export default PlayerMessageItem;
