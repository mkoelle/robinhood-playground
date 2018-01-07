'use strict';

const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');
const compression = require('compression');

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;
let users = [];
let sockets = {};

app.use(compression({}));
app.use(express['static'](__dirname + '/../client'));

io.on('connection', (socket) => {

    socket.on('disconnect', () => {

        socket.broadcast.emit('userDisconnect');
    });

});

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});
