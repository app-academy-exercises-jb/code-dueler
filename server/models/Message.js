const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const MessageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

MessageSchema.statics.post = async function (author, body, user, pubsub) {
  if (author !== user._id.toString()) return {
    success: false,
    message: "User authentication failed: wrong user",
    messages: []
  };
  const Message = this,
    newMessage = new Message({author: user, body});

  await newMessage.save();

  pubsub.publish('messageAdded', newMessage);
  
  return {
    success: true,
    message: "Message posted",
    messages: [newMessage]
  };
}
  
module.exports = mongoose.model('Message', MessageSchema);
