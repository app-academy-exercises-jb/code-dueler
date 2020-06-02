const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const FunctionNameSchema = new Schema({
  language: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  argList: {
    type: String,
    required: true,
  }
});

const TestCaseSchema = new Schema({
  test: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  }
});

const QuestionSchema = new Schema({
  challenge: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    type: String,
    required: true,
  },
  functionNames: {
    type: [FunctionNameSchema],
    required: true
  },
  testCases: {
    type: [TestCaseSchema],
    required: true
  }
});

QuestionSchema.statics.add = async function ({challenge, body, functionNames, testCases}) {
  const Question = this,
    newQuestion = new Question({challenge, body, functionNames, testCases});

  await newQuestion.save()
    .then(res => console.log({res}))
    .catch(err => console.error({err}));
}
  
module.exports = mongoose.model('Question', QuestionSchema);
