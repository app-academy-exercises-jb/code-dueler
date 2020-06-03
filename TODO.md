### needs to get done:
* in game screen, player stats boxes become deformed when the stats popup is visible

* logout in one browser causes logout in every browser. should only log out the one browser

* tooltip can sometimes be made to stay visible. find out how to reproduce and fix

* when in game lobby, and screen width is such that the hamburger menu is visible, put the relevant game action button (start game, un/ready, claim/challenge) at the bottom of the sidebar

* splash page slideshow slides / gifs need to be reworked
  - would be nice to show off the spectator's view

* plus signs not working in prod (in game lobby, Players / Spectators buttons)
  - for some reason webpack is parsing that image as a `data:` URI as opposed to a local file, like every other PNG in the project

* game won notif does: "undefined just beat $LOSER_USERNAME at a code duel!". `undefined` should actually be the winning player's username
  - when a player leaves a game, we remove them from that inMem game. this makes sense when the game is 'initializing', ie in the lobby stage. but if it is ongoing or over, we should not remove them from the game, just from the inGame marker. 

* credits link should not appear on credits page

* dropdown menu lies behind welcome screen

* when a players submits code, they should see an indication (animation), and the button should be locked

* make choose challenge modal
* host should be able to click on challenge Q title and see choose challenge modal in game lobby
* when hosting game, one should see the choose challenge modal

* if both players submit within a short time of each other, and at least one is correct, the modals go crazy

### nice to haves:
* leverage the remnants of the invitation nonsense to give the Host the ability to 'invite players' to the current game

* It would be nice if the editor saved its value to the cache (for reconnections in a single game)

* the backend needs to be totally reworked
    - the ideal would be to have a web platform where one could upload Q's w/ reference implementations and test cases
    - add to that a larger collection of algo questions
