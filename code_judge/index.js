const mongoose = require("mongoose"),
  Queue = require("bull"),
  nodeJudge = require('./judges/nodeJudge'),
  rubyJudge = require('./judges/rubyJudge');

require('./Question');

const connectMongoose = () => {
  switch (mongoose.connection.readyState) {
    case 1:
      clearInterval(connectMongoose);
      break;
    case 0:
      mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      .then(() => {
        console.log("Connected to MongoDb");
        clearInterval(connectMongoose);
      })
      .catch((err) => console.log(`Could not connect to MongoDB: ${err}. retrying...`));
      break;
    case 2:
    case 3:
      clearInterval(connectMongoose);
      break;
    default:
      throw mongoose.connection.readyState;
      break;
  }    
}

setInterval(connectMongoose, 500);


const jobQueue = new Queue('code-review', process.env.REDIS_URI);

jobQueue.process('submitCode', async job => {
  const Question = mongoose.model('Question'),
    { code, challenge, language } = job.data,
    {
      functionNames,
      testCases
    } = await Question.findOne({ challenge });
    // remember that all question testCases are JSON strings

  const testName = functionNames.find(fn => fn.language === language).name;

  const runtimeDetails = {
    code, testName, testCases
  };

  return new Promise((resolve, reject) => {
    switch (language) {
      case 'javascript':
        nodeJudge(runtimeDetails, resolve, reject);
        break;
      case 'ruby':
        rubyJudge(runtimeDetails, resolve, reject);
        break;
      default:
    }
  });
});
