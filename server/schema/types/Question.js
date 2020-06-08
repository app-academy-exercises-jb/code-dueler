const mongoose = require("mongoose");
const Question = mongoose.model("Question");

const typeDefs = `
  type Question {
    _id: ID!
    challenge: String!
    functionNames: [FunctionName]
    testCases: [TestCase]
  }
  type FunctionName {
    language: String!
    name: String!
  }
  type TestCase {
    test: String!,
    solution: String!
  }
  type QuestionHeader {
    _id: ID!
    challenge: String!
    languages: [String]!
  }
  extend type Query {
    getQuestions(filter: String!): [QuestionHeader]
  }
  extend type Mutation {
    addQuestion(
      testCases: String!,
      functionNames: String!,
      challenge: String!,
      body: String!
    ): String!
  }
`;

const resolvers = {
  Query: {
    async getQuestions(_, { filter }, ___) {

      const questions = await Question.find({
        challenge: new RegExp(filter, 'i')
      });

      return questions.map(q => ({
        _id: q._id.toString(),
        challenge: q.challenge,
        languages: q.functionNames.map(fn => fn.language)
      }));
    }
  },
  Mutation: {
    addQuestion(_, {testCases, functionNames, challenge, body}, ___) {
      Question.add({
        challenge,
        body,
        functionNames: JSON.parse(functionNames),
        testCases: JSON.parse(testCases) });

      return "ok";
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
