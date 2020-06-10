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
  * fix bug where certain games with status "over" sometimes stay in the game list. related to the bug where leaving game from spectators (when one is the last player) doesn't properly delete the in-memory game
  * added temporary fix for the img-src CSP issue leading to non-loading images in game lobby

## 0.9.2 - 6/7/2020

  * fixed issue where logout in one browser caused logout in every browser
  * added frontend ability to choose the challenge/language you want to play
  * cleaned up frontend compiler warnings

## 0.9.3 - 6/8/2020

  * fixed coding judges to asynchronously download missing images prior to judging
  * simplified mutations to add challenges. Challenges look like this:
  ```
    {
      challenge: Title Case String, title of the challenge
      body: Whitespace-including string, description of the challenge
      functionNames: Array of objects: {
        language: lowercase string, supported language keyword
        name: Language-dependent casing string, name of function which we expect user to define
        argList: Language-dependent casing, comma separated string of arguments
      }
      testCases: Array of objects: {
        test: JSON compliant string representing an array of arguments
        solution: JSON compliant string representing the expected output
      }
    }
  ```

## 0.9.4 - 6/9/2020

  * added feature to generate random user
  * added Demo User/Generate New User links to the welcome page, in lieu of Login/Signup (which are in the navbar)
  * fixed credits link in navbar shennanigans
  * fixed interaction between dropdown and splash page slideshow
  * reshuffled some TODO's priority
  * our docker images had the whole of node_modules! fixed

## 0.9.5 - 6/10/2020

  * remove graphql playground due to a [package vulnerability](https://github.com/advisories/GHSA-4852-vrh7-28rf)