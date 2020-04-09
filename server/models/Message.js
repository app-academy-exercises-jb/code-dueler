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
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  channelId: {
    type: String,
    default: "global",
    required: true
  }
});

MessageSchema.statics.post = async function ({author, body, user, channelId, pubsub}) {
  if (author !== user._id.toString()) return {
    success: false,
    message: "User authentication failed: wrong user",
    messages: []
  };

  if (!channelId) channelId = "global";

  const Message = this,
    newMessage = new Message({author: user, body, channelId});

  await newMessage.save();
  
  const postedMessage = Object.assign({}, newMessage._doc, {author: user});
  pubsub.publish('messageAdded', postedMessage);

  
  return {
    success: true,
    message: "Message posted",
    messages: [postedMessage]
  };
}
  
module.exports = mongoose.model('Message', MessageSchema);
