# CodeDueler
#### Tighten Up.
---

## Overview & Key Features

  CodeDueler is a live streaming app which allows you to race your friends through coding challenges. The main feature is a coding editor screen which presents a coding challenge where a user can see their own and their partner's progress in the form of a live character count. The code editor will provide useful syntax highlighting, and basic parsing to prevent code submissions which contain syntax errors. 

  The user can choose to either "Run Code" or "Submit Code" (a la leetcode). When they "Run Code" they are shown the results of their code against one or two test cases. The code is run locally.
  
  When a user "Submit(s) Code", a request is initiated to an online Compute-On-Demand service (AWS Lambda/Google Cloud Function) which returns either the return value of the given submission or the error which it raised. This service has access to a greater number of test cases, and returns to us the results.  The first user to return a fully correct set 'wins'.

## MVP List

  1. User Auth
      - Sign Up/In Page
  1. User Index Page (Global Lobby)
  1. JavaScript Live Coding Editor
      - Syntax highlighting
      - Test cases + custom test cases
      - live character count (you v them)
      - show of test cases passed (you v them)
      - submission notifs ? 
  1. Live Coding Spectator
      - can view friend's currently ongoing games
      - viewer's chat room
  1. Production README


#### Bonus Features

  1. Global Game Feed
      - past games are published as events
        - can be ordered chronologically or by popularity
        - message 
      - game events can be 'liked'
      - game events can be commented on
      - game events retain comments made during their live session
  1. User's Game Feed
  1. 'Friends'
  1. Private Lobbies (as opposed to the Global Lobby)

## Pages

  1. User Auth 
  2. Global Lobby
  3. In-Game Screen
  4. Game Spectator

## Weekend Plans / Things that should be done before Monday

  1. User auth functionality complete __BY__ EOD 4/3
      - user mongoose schema
      - user typedefs, queries, mutations
      - current user query
      - Login/Signup Page Styling a la YT
      - Nav Bar (username and logout)
      - User Auth Page
  1. Global Lobby Page
      - websocket server
      - chat component
          - graphql 'subscription'
          - messages mongoose schema
          - message typedefs, queries, mutations          
      - list of available users. each list item contains:
          - name 
          - status (available/in-game) icon
          - challenge button (if available)

## Notes

   Back in 2012 some company put out http://coderace.me, which seems to be defunct at this point. Judging from YCombinator comments from the time, people were interested but were put off by the requirement to use a Facebook based login.
