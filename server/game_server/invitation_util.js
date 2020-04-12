const invitationUtil = pubsub => {

  const handleInvite = (user, action, doc) => {
    if (action === "inviting") {
      let invitable = true, 
        result = {};
      
      if (doc.inviter._id === doc.invitee._id) {
        invitable = false;
        result = {
          status: "rejected",
          reason: "One-player mode coming soon :)"
        }
      } else if (pubsub.games.pendingInvites[user._id]) {
        invitable = false;
        result = {
          status: "rejected",
          reason: "That player's already been challenged by someone else!"
        }
      } else if (pubsub.games.inGame[user._id]) {
        invitable = false;
        result = {
          status: "rejected",
          reason: "That player's already in another game!"
        }
      } else {
        pubsub.games.pendingInvites[user._id] = true;
      }

      if (invitable) {
        pubsub.publish("invitationEvent", doc);
      } else {
        console.log("publishing rejection...")
        console.log({inGame: pubsub.games.inGame})
        console.log({pending: pubsub.games.pendingInvites})
        Object.assign(doc, result);
        pubsub.publish("invitationEvent", doc);
      }

    } else if (action === "accepted") {
      if (pubsub.games.inGame[user._id] !== true) {
        pubsub.games.pendingInvites[doc.invitee._id] = false;
        pubsub.publish("invitationEvent", doc);
      }
    } else if (action === "declined") {
      pubsub.games.pendingInvites[doc.invitee._id] = false;
      pubsub.publish("invitationEvent", doc);
    }
  };

  pubsub.handleInvite = handleInvite;
};

module.exports = invitationUtil;
