# CodeRacer / CodeDuel

## Overview & Key Features

  CodeDuel is a live streaming app which allows you to race your friends doing coding challenges. The main feature is a screen which presents a coding challenge where each user can see their own and the other's progress <`should a user be shown another user's actual code? is there another way to provide the livestream feel?`>. The code editor will provide useful syntax highlighting, and basic parsing to prevent code submissions which contain syntax errors. 

  When a piece of code is submitted by the user, a request is initiated to an online Compute-On-Demand service (AWS Lambda/Google Cloud Function) which returns either the return value of the given submission or the error which it raised. On our end, we then check the return value against what we know the answer to the challenge to be. The first user to return a correct value 'wins'.

  Apart from this main game screen, the app will have a number of engaging social features. Ideas:
  - 'Winning' a challenge round will earn the user points, based on (the difficulty of the challenge/their submission's runtime/arbitrary decisions we make). We can have high score boards based on these points

  - Users can have 'friends' which they can easily access in order to challenge them to a CodeDuel
  - The main screen can have a chatting component to it
  - Other users can 'spectate' a duel, and they can comment on it amongst themselves. Perhaps this would be the way to go if we don't show a player the other person's screen?
  