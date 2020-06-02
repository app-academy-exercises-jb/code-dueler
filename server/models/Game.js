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
});

const GameSchema = new Schema({
  p1: {
    type: PlayerSchema,
    required: false,
  },
  p2: {
    type: PlayerSchema,
    required: false,
  },
  spectators: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    default: 'initializing',
    required: true,
  },
  winner: {
    type: String,
    required: false
  }
});

mongoose.Schema.Types.String.checkRequired(v => v !== null);

GameSchema.statics.start = async (challenge, language, user, ws, pubsub) => {
  const Question = mongoose.model('Question');
  let question = false;
  await Question
    .find({ challenge })
    .then(res => {
      if (res.length === 0) return;
      question = res[0];
    })
    .catch(err => console.log({err}));
  
  if (!Boolean(question)) return null;
  
  const Game = mongoose.model('Game'),
    Player = mongoose.model('Player'),
    p1 = new Player({
      user: user._id,
      ready: true,
    }),
    game = new Game({
      p1
    });
    
  await p1.save();
  await game.save();

  user.pId = p1._id;
  pubsub.initGame({
    ws,
    user,
    game,
    Game,
    question: {
      language,
      challenge,
      challengeBody: question.body,
      fn: question.functionNames.find(fn => fn.language === language),
    }
  });

  return game._id;
}

module.exports = mongoose.model('Game', GameSchema);
