import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

//imports
import { findUserById, removeUser, addUser }  from './users'
import { logger } from './utils/logger';
import { IsNullOrWhitespace } from './utils/validate';
import router from './router';
import { User } from './models';

//variables (configurable)
const CHATROOM:string = 'chatroom';
const CHATBOT:string = 'BOT: Aslan';
const INACTIVITYTIMELIMIT:number = 300000; //5min
const port: string | number = process.env.PORT || 5000;
const logDir:string = process.env.LOG_DIRECTORY || 'log';


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// If logDir directory does not exist, create one. (where the logging will be stored);
if(!fs.existsSync(logDir)) fs.mkdirSync(logDir);


app.use(express.static(__dirname + '../build'));
app.use(bodyParser.json())
app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  logger.info('WEBSOCKET CONNECTION ESTABLISHED');

  // a named setTimeout to be able to reset if user is active.
  let inactivityTimeout: NodeJS.Timeout | null = null;
  
  // function that will be called if user has been inactive for too long (INACTIVITYTIMELIMIT)
  const userInactive = (name:string) => {

  socket.emit('inactive', {message: 'You got disconnected due to inactivity'});
  socket.leave(CHATROOM);
  socket.broadcast.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: `${name} was disconnected due to inactivity`, role: 'admin'});
  }

  //entered_chat triggers everything that is needed for when user has entered the chat.
  socket.on('entered_chat', ({ user }) => {
    //give user id of its socket id
    const registerUser = addUser({name: user.name, id:socket.id});
    logger.info('USER ENETERED CHAT', registerUser)

    socket.join(CHATROOM);
    
    socket.emit('adminMessage', { user: registerUser, name: CHATBOT, message: `Welcome to the chatroom ${user.name}!`, role: 'admin'});

    socket.broadcast.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: `${user.name} has joined the chat!`, role: 'admin'});

    //start the inactivity timer when user enters chat
    inactivityTimeout = setTimeout(() => {
      userInactive(user.name);
      logger.info('USER DISCONNECTED DUE TO INACTIVITY', registerUser)
    }, INACTIVITYTIMELIMIT);    
  });

  //message triggers everything that is needed when a user sends a message to the server
  socket.on('message', (message) => {
    //write messages to file later
    logger.info('SERVER RECIEVED MESSAGE FROM A USER', message)

    //reset inactivity timer because the user just sent a message. 
    if(inactivityTimeout) {
      clearTimeout(inactivityTimeout);

      inactivityTimeout = setTimeout(() => {
        userInactive(message.name);
        logger.info('USER DISCONNECTED DUE TO INACTIVITY', {name:message.name, id:socket.id})
      }, INACTIVITYTIMELIMIT); 
    }

    //emit message to clients if its not nul or whitespace (empty). 
    if(!IsNullOrWhitespace(message.chatMessage)) {
      socket.emit('message', { name: message.name, message: message.chatMessage, role: 'client' });
      socket.broadcast.to(CHATROOM).emit('message', { name: message.name, message: message.chatMessage, role: 'other' });
    }
  })

  //leave_chat triggers everything that is needed when the user disconnects from the socket, client-side
  socket.on('leave_chat', ({user}) => {
    logger.info('USER LEFT CHAT', user)

    socket.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message:`${user.name} has left the chat!`, role: 'admin',});
    socket.emit('leave_chat', {message: 'Hope you had fun, bye!'})
    socket.leave(CHATROOM);
  });

  //disconnect triggers everything that is needed when server disconnects the socket.
  socket.on('disconnect', (reason) => {
    const user = findUserById(socket.id);
    logger.info('USER GOT DISCONNECTED', user);
    
    if (user) socket.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: `${user.name} left the chat, connection lost`, role: 'admin',  disconnect: true});
    
    //removes user from "users" array, so that the nickname can be used again
    removeUser(socket.id);
    
    //removes timer because it isnt needed and can create problems. 
    if(inactivityTimeout) {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = null;
    }
  })
});

server.listen(port, () => logger.info(`Server has started.`));


//triggers things that need to be done on SIGINT and SIGTERM, close the server/socket properly. 
process.on('SIGINT', () => {
  logger.info('SIGINT signal recieved.');
  logger.info('Shutting down server');

  if(io) {
    io.close(() => {
      logger.info('server shut down.');
      process.exit(0)
    })
  }
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal recieved.');
  logger.info('Shutting down server');
  
  if(io) {
    io.close(() => {
      logger.info('server shut down.');
      process.exit(0)
    })
  }
})