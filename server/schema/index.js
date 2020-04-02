const mongoose = require('mongoose'),
  { makeExecutableSchema } = require('graphql-tools'),
  { merge } = require('lodash'),
  types = require('./types');

const typeDefs = `
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

module.exports = {
  schema: makeExecutableSchema({
    typeDefs: [...types.map(t => t.typeDefs), typeDefs],
    resolvers: merge(...types.map(t => t.resolvers)),
    logger: { log: e => console.log('\x1b[31m%s\x1b[0m', e.message) }
  }),
  resolvers: merge(...types.map(t => t.resolvers)),
};
