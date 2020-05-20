const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastSubmittedResult: {
    type: String,
    default: '',
    required: true,
  },
  charCount: {
    type: Number,
    default: 0,
    required: true,
  },
  lineCount: {
    type: Number,
    default: 0,
    required: true,
  },
  currentCode: {
    type: String,
    default: '',
    required: true,
  },
  ready: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model('Player', PlayerSchema);
