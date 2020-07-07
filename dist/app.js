"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var fs_1 = __importDefault(require("fs"));
//imports
var users_1 = require("./users");
var logger_1 = require("./utils/logger");
var validate_1 = require("./utils/validate");
var router_1 = __importDefault(require("./router"));
//variables (configurable)
var CHATROOM = 'chatroom';
var CHATBOT = 'BOT: Aslan';
var INACTIVITYTIMELIMIT = 60000;
var port = process.env.PORT || 5000;
var logDir = process.env.LOG_DIRECTORY || 'log';
var app = express_1.default();
var server = http_1.default.createServer(app);
var io = socket_io_1.default(server);
// If logDir directory does not exist, create one. (where the logging will be stored);
if (!fs_1.default.existsSync(logDir))
    fs_1.default.mkdirSync(logDir);
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.use(router_1.default);
io.on('connect', function (socket) {
    logger_1.logger.info('WEBSOCKET CONNECTION ESTABLISHED');
    // a named setTimeout to be able to reset if user is active.
    var inactivityTimeout = null;
    // function that will be called if user has been inactive for too long (INACTIVITYTIMELIMIT)
    var userInactive = function (name) {
        socket.emit('inactive', { message: 'You got disconnected due to inactivity' });
        socket.leave(CHATROOM);
        socket.broadcast.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: name + " was disconnected due to inactivity", role: 'admin' });
    };
    //entered_chat triggers everything that is needed for when user has entered the chat.
    socket.on('entered_chat', function (_a) {
        var user = _a.user;
        //give user id of its socket id
        var registerUser = users_1.addUser({ name: user.name, id: socket.id });
        logger_1.logger.info('USER ENETERED CHAT', registerUser);
        socket.join(CHATROOM);
        socket.emit('adminMessage', { user: registerUser, name: CHATBOT, message: "Welcome to the chatroom " + user.name + "!", role: 'admin' });
        socket.broadcast.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: user.name + " has joined the chat!", role: 'admin' });
        //start the inactivity timer when user enters chat
        inactivityTimeout = setTimeout(function () {
            userInactive(user.name);
            logger_1.logger.info('USER DISCONNECTED DUE TO INACTIVITY', registerUser);
        }, INACTIVITYTIMELIMIT);
    });
    //message triggers everything that is needed when a user sends a message to the server
    socket.on('message', function (message) {
        //write messages to file later
        logger_1.logger.info('SERVER RECIEVED MESSAGE FROM A USER', message);
        //reset inactivity timer because the user just sent a message. 
        if (inactivityTimeout) {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(function () {
                userInactive(message.name);
                logger_1.logger.info('USER DISCONNECTED DUE TO INACTIVITY', { name: message.name, id: socket.id });
            }, INACTIVITYTIMELIMIT);
        }
        //emit message to clients if its not nul or whitespace (empty). 
        if (!validate_1.IsNullOrWhitespace(message.chatMessage)) {
            socket.emit('message', { name: message.name, message: message.chatMessage, role: 'client' });
            socket.broadcast.to(CHATROOM).emit('message', { name: message.name, message: message.chatMessage, role: 'other' });
        }
    });
    //leave_chat triggers everything that is needed when the user disconnects from the socket, client-side
    socket.on('leave_chat', function (_a) {
        var user = _a.user;
        logger_1.logger.info('USER LEFT CHAT', user);
        socket.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: user.name + " has left the chat!", role: 'admin', });
        socket.emit('leave_chat', { message: 'Hope you had fun, bye!' });
        socket.leave(CHATROOM);
    });
    //disconnect triggers everything that is needed when server disconnects the socket.
    socket.on('disconnect', function (reason) {
        var user = users_1.findUserById(socket.id);
        logger_1.logger.info('USER GOT DISCONNECTED', user);
        if (user)
            socket.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: user.name + " left the chat, connection lost", role: 'admin', disconnect: true });
        //removes user from "users" array, so that the nickname can be used again
        users_1.removeUser(socket.id);
        //removes timer because it isnt needed and can create problems. 
        if (inactivityTimeout) {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = null;
        }
    });
});
server.listen(port, function () { return console.log("Server has started."); });
//triggers things that need to be done on SIGINT and SIGTERM, close the server/socket properly. 
process.on('SIGINT', function () {
    logger_1.logger.info('SIGINT signal recieved.');
    logger_1.logger.info('Shutting down server');
    if (io) {
        io.close(function () {
            logger_1.logger.info('server shut down.');
            process.exit(0);
        });
    }
});
process.on('SIGTERM', function () {
    logger_1.logger.info('SIGTERM signal recieved.');
    logger_1.logger.info('Shutting down server');
    if (io) {
        io.close(function () {
            logger_1.logger.info('server shut down.');
            process.exit(0);
        });
    }
});
