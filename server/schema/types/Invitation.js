const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");

const User = mongoose.model("User");

const typeDefs = `
  extend type Mutation {
    invitePlayer(invitee: ID!): InvitationUpdate!
    acceptInvitation(inviter: ID!): InvitationUpdate!
    declineInvitation(inviter: ID!): InvitationUpdate!
  }
  extend type Subscription {
    invitationEvent: InvitationUpdate!
  }
  type InvitationUpdate {
    inviter: User!
    invitee: User!
    status: String!
  }
`;

const resolvers = {
  Mutation: {
    invitePlayer: async (_, { invitee }, { user, pubsub }) => {
      if (!user) console.log("no user");
      const invitation = {
        inviter: user,
        invitee: await User.findById(invitee),
        status: "inviting"
      };
      pubsub.publish("invitationEvent", invitation);
      return invitation;
    },
  },
  Subscription: {
    invitationEvent: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator("invitationEvent"),
        ({ invitee }, _, { user }) => {
          return invitee._id === user._id;
        }
      ),
      resolve: payload => {
        console.log("resolving invitation")
        return payload;
      }
    },
  }
}

module.exports = {
  typeDefs,
  resolvers,
};
