### needs to get done:
* in game screen, player stats boxes become deformed when the stats popup is visible

* splash page slideshow slides / gifs need to be reworked
  - would be nice to show off the spectator's view

* game won notif does: "undefined just beat $LOSER_USERNAME at a code duel!". `undefined` should actually be the winning player's username
  - when a player leaves a game, we remove them from that inMem game. this makes sense when the game is 'initializing', ie in the lobby stage. but if it is ongoing or over, we should not remove them from the game, just from the inGame marker. 

* when a players submits code, they should see an indication (animation)

* if both players submit within a short time of each other, and at least one is correct, the modals go crazy

### nice to haves:
* tooltip can sometimes be made to stay visible. find out how to reproduce and fix

* when hosting game, while in game lobby, one should be able to change the challenge and its language

* leverage the remnants of the invitation nonsense to give the Host the ability to 'invite players' to the current game

* It would be nice if the editor saved its value to the cache (for reconnections in a single game)

* the backend needs to be totally reworked
    - the ideal would be to have a web platform where one could upload Q's w/ reference implementations and test cases
    - add to that a larger collection of algo questions

* when in game lobby, and screen width is such that the hamburger menu is visible, put the relevant game action button (start game, un/ready, claim/challenge) at the bottom of the sidebar