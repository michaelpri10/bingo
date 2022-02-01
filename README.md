# Bingo Application

This is a multiplayer bingo application that allows multiple players to play together using WebSockets. Users open the game and enter their username to join the lobby. Once 5 players have joined, they will each be given a card and will start to play bingo.

The client and server application must be run separately from each other.

For the server, run:

`cd server`
`npm install`
`npm start`

For the client, run in a separate terminal:

`cd client`
`npm install`
`npm start`

Currently, 3 players must be logged on concurrently to start the game. The BINGO button should be clicked when a user thinks that they have a winning Bingo board.

Further work:

- User accounts
- Variable size games
- New games and regenerating boards
- Better designs
