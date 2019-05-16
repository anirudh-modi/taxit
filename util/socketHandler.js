"use strict";
var socketServer;
var socketByIdCollection = {};
/**
 * A socket connection can be made from app.js
 * and for file segregation
 * @param http
 */
exports.createSocketIOServer = function (http) {
    socketServer = require('socket.io')(http);

    listenToNewConnections();
};

function listenToNewConnections() {
    socketServer.on('connection', function (socket) {
        console.log(`A new client connected - ${socket.id}`);
        socketByIdCollection[socket.id] = socket;
    });

    socketServer.on('disconnect', function (socket) {
        console.log(`${socket.id} disconnected`);
        delete socketByIdCollection[socket.id];
    });
}

exports.sendEmit = function (message, socketId) {
    if (socketId) {
        socketByIdCollection[socketId].broadcast.emit(message);
    }
    else {
        socketServer.emit(message);
    }
}