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
      if (!user) console.log("no user");
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
      pubsub.handleGames({
        gameId: acceptance.gameId,
        p1: acceptance.inviter,
        p2: user
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
          console.log("i go off 3 times")
          if (status === "inviting") {
            if (invitee._id === user._id) {console.log("marking ws as invited"); ws.invited = true;}
            return invitee._id === user._id;
          } else if (status === "declined") {
            return inviter._id === user._id;
          } else if (status === "accepted") {
            const shouldSend = (ws.inviting || (ws.invited && ws.accepting));
            if (shouldSend) ws.gameId = gameId;

            delete ws.inviting;
            delete ws.invited;
            delete ws.accepting
            return shouldSend && (inviter._id === user._id || invitee._id === user._id);
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


// handle pubsub.games
// pubsub.publish("gameEvent", {
//   p1: inviter,
//   p2: invitee,
//   spectators: [],
//   status: "initializing",
//   gameId: inviter._id + invitee._id + Date.now()
// })