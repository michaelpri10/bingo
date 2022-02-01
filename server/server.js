const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);

const port = 4001;

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const ioHandlers = require('./socket.js')(io);

server.listen(port, () => console.log(`Listening on port ${port}`));