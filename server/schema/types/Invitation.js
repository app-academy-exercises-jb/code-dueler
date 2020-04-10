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
    gameId: String
  }
`;

const getUser = (user) => ({
  _id: user._id.toString(),
  username: user.username,
});

const makeInvite = async (options) => {
  const {
    status,
    user,
    toAwait: { key, awaitedUser },
  } = options;

  const otherKey = key === "inviter" ? "invitee" : "inviter";

  return {
    [otherKey]: getUser(user),
    [key]: getUser(await User.findById(awaitedUser)),
    status,
  };
};

const resolvers = {
  Mutation: {
    invitePlayer: async (_, { invitee }, { user, pubsub, ws }) => {
      const invitation = await makeInvite({
        status: "inviting",
        user,
        toAwait: { key: "invitee", awaitedUser: invitee },
      });
      ws.inviting = true;
      pubsub.publish("invitationEvent", invitation);
      return invitation;
    },
    acceptInvitation: async (_, { inviter }, { user, pubsub, ws }) => {
      const acceptance = await makeInvite({
        status: "accepted",
        user,
        toAwait: { key: "inviter", awaitedUser: inviter },
      });
      acceptance.gameId = inviter + user._id + Date.now().toString();
      ws.accepting = true;

      const newP1 = {...acceptance.inviter, ws};

      pubsub.handleGames({
        gameId: acceptance.gameId,
        p1: newP1,
        p2: user,
        initializeGame: pubsub => setTimeout(() => {
          pubsub.publish("gameEvent", {
            p1: newP1,
            p2: user,
            spectators: [],
            status: "initializing",
            gameId: acceptance.gameId
          })
        }, 0)
      });

      pubsub.publish("invitationEvent", acceptance);
      return acceptance;
    },
    declineInvitation: async (_, { inviter }, { user, pubsub }) => {
      const declination = await makeInvite({
        status: "declined",
        user,
        toAwait: { key: "inviter", awaitedUser: inviter },
      });
      pubsub.publish("invitationEvent", declination);
      return declination;
    },
  },
  Subscription: {
    invitationEvent: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator("invitationEvent"),
        ({ inviter, invitee, status, gameId }, _, { user, ws, pubsub }) => {
          if (status === "inviting") {
            if (invitee._id === user._id) ws.invited = true;
            return invitee._id === user._id;
          } else if (status === "declined") {
            return inviter._id === user._id;
          } else if (status === "accepted") {
            const shouldSend = (ws.inviting || (ws.invited && ws.accepting));
            if (shouldSend && (inviter._id === user._id || invitee._id === user._id)) {
              ws.gameId = gameId;
            }

            delete ws.inviting;
            delete ws.invited;
            delete ws.accepting;
            return shouldSend && (inviter._id === user._id || invitee._id === user._id);
          }
        },
      ),
      resolve: (payload) => {
        return payload;
      },
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};


// handle pubsub.games
