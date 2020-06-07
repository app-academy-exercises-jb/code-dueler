const mongoose = require("mongoose");
const Question = mongoose.model("Question");

const typeDefs = `
  type Question {
    _id: ID!
    challenge: String!,
    functionNames: [FunctionName],
    testCases: [TestCase]
  }
  type FunctionName {
    language: String!,
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
    addQuestion: String!
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
    addQuestion(_, __, ___) {
      const fizzBuzzReference = function (n) {
        let ans = [];
        for (let i = 1; i <= n; i++) {
          if (i % 3 === 0 && i % 5 === 0) {
            ans.push("FizzBuzz");
          } else if (i % 3 === 0) {
            ans.push("Fizz");
          } else if (i % 5 === 0) {
            ans.push("Buzz");
          } else {
            ans.push(i.toString());
          }
        }
        return ans;
      };

      let testCases = [];

      while (testCases.length < 99) {
        let randTest = Math.floor(Math.random() * 50 + 1);
        testCases.push({
          test: JSON.stringify(randTest),
          solution: JSON.stringify(fizzBuzzReference(randTest))
        });
      }

      testCases.push({
        test: JSON.stringify(10000),
        solution: JSON.stringify(fizzBuzzReference(10000))
      });
      
      Question.add({
        challenge: "FizzBuzz",
        body: `\
Write a function that outputs the string representation of numbers from 1 to n.\n\n\
But for multiples of three it should output “Fizz” instead of the number and for the multiples of five output “Buzz”. For numbers which are multiples of both three and five output “FizzBuzz”.\n\n\
Example:\n\n\
n = 15, Return: [ "1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz" ]`,
        functionNames: [
          {
            language: "javascript",
            name: "fizzBuzz"
          },
          {
            language: "ruby",
            name: "fizz_buzz"
          }
        ],
        testCases,
      })

      return "ok";
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
