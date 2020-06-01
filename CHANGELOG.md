# Changelog

## 0.7.0 - 4/15/2020

  * Initial release

## 0.8.0 - 5/20/2020

  * Game Lobbies Feature added

## 0.8.1 - 5/20/2020

  * External dependencies cleaned up
  * Serve icons on own server

## 0.8.2 - 5/20/2020

  * Credits link fixed in dropdown

## 0.8.3 - 5/21/2020

  * Non-persisting messages are now sent to the main chat when a game is started or won
  * Names longer than 95px ellipse in the sidebar

## 0.8.3.1 - 5/22/2020

  * Fix problem where games would not be finished when all players disconnect

## 0.9.0 - 5/29/2020

  * rework coding judge to locally run docker service consisting of a master and an indefinite amount of worker processes. the master runs a redis job queue which the workers consume
  * judge workers create a docker container to run user code in. this makes it simple to add more languages
  * coding judge made resilient against fork bombs, timeouts, and other such malicious use
  * coding judge rate limited at the game server level -- only one running submission per WS at a time
  * coding judge now accurately captures user code's console.logs and error stack trace
  * questions now on Mongo. adding new questions should now be fairly simple

## 0.9.1 - 6/1/2020

  * simplify coding judge to just one worker, which can be horizontally scaled. code submission queue is now run by the game server.