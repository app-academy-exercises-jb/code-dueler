### what i think will be easy and great is:

   - making a specialty auth component to only render inGame
   - 

   - logging in and out / signing up in the same browser session should behave as expected
   - if a client has multiple connections and they log out on one, the rest should be logged out

   - when an invite is sent, an animated "..." should appear next to their name until they respond
   - a modal should inform a user of when they are unable to invite another one to a game, if the latter is in a game, or pending an invitation


# Main Chunks of The Matter

- spectator page working
- third page needs: 
  - code change mutation works, as does subscription: must be plugged into stats
  - code editor must have adequate default text
  - code submission mutation must work: server must listen 
  - when resolving to an ingame player, must wipe other player's current code
  - 
- lobby needs: 
  - invititation rejection modal
  - invititation logic mentioned above