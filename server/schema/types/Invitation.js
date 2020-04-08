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

const getUser = (user) => ({
  _id: user._id,
  username: user.username,
  loggedIn: user.loggedIn,
});

const makeInvite = async (options) => {
  const {
    status,
    user,
    toAwait: { key, awaitedUser },
  } = options;

  const otherKey = key === "inviter" ? "invitee" : "inviter";

  return {
    [otherKey]: user,
    [key]: await User.findById(awaitedUser),
    status,
  };
};

const resolvers = {
  Mutation: {
    invitePlayer: async (_, { invitee }, { user, pubsub }) => {
      if (!user) console.log("no user");
      const invitation = await makeInvite({
        status: "inviting",
        user,
        toAwait: { key: "invitee", awaitedUser: invitee },
      });
      pubsub.publish("invitationEvent", invitation);
      return invitation;
    },
    acceptInvitation: async (_, { inviter }, { user, pubsub }) => {
      const acceptance = await makeInvite({
        status: "accepted",
        user,
        toAwait: { key: "inviter", awaitedUser: inviter },
      });
      pubsub.publish("invitationEvent", acceptance);
    },
    declineInvitation: async (_, { inviter }, { user, pubsub }) => {
      const declination = await makeInvite({
        status: "declined",
        user,
        toAwait: { key: "inviter", awaitedUser: inviter },
      });
      pubsub.publish("invitationEvent", declination);
    },
  },
  Subscription: {
    invitationEvent: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator("invitationEvent"),
        ({ inviter, invitee, status }, _, { user }) => {
          if (status === "inviting") {
            return invitee._id === user._id;
          } else if (status === "declined" || status === "accepted") {
            return inviter._id === user._id;
          }
        }
      ),
      resolve: (payload) => {
        console.log("resolving invitation");
        return payload;
      },
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
