const mongoose = require('mongoose');

const messageUtil = pubsub => {
  const publishMessage = ({message, author, channelId}) => {
    if (!author) author = {
      _id: '5ec67c304d861000117bf90f',
      username: 'CodeDueler'
    };
    pubsub.publish("messageAdded", {
      _id: mongoose.Types.ObjectId(),
      author,
      body: message,
      createdAt: Date.now(),
      channelId: channelId || 'global',
    });
  };

  pubsub.publishMessage = publishMessage;
};

module.exports = messageUtil;