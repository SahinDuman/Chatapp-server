import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

import {giveUserSocketId, findUserById, removeUser }  from './users'
import { logger } from './utils/logger';
import router from './router';

const CHATROOM:string = 'chatroom';
const CHATBOT:string = 'BOT: Aslan';
const INACTIVITYTIMELIMIT:number = 60000;
const logDir:string = process.env.LOG_DIRECTORY || 'log';


const app = express();
const server = http.createServer(app);
const io = socketio(server, { pingTimeout: INACTIVITYTIMELIMIT });

if(!fs.existsSync(logDir)) fs.mkdirSync(logDir);


app.use(bodyParser.json())
app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  logger.info('WEBSOCKET CONNECTION ESTABLISHED');
  
  let inactivityTimeout: NodeJS.Timeout | null = null;
  
  const ifUserInactive = (name:string) => {

  socket.emit('inactive', {message: 'You got disconnected due to inactivity'});
  socket.leave(CHATROOM);
  socket.broadcast.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: `${name} was disconnected due to inactivity`, role: 'admin'});
  }

  socket.on('entered_chat', ({ user }, callback) => {
    const userWithId = giveUserSocketId(user.name, socket.id);
    logger.info('USER ENETERED CHAT', userWithId)
    
    socket.join(CHATROOM);
    
    socket.emit('adminMessage', { user: userWithId, name: CHATBOT, message: `Welcome to the chatroom ${user.name}!`, role: 'admin'});

    socket.broadcast.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: `${user.name} has joined the chat!`, role: 'admin'});

    inactivityTimeout = setTimeout(() => {
      ifUserInactive(user.name);
      logger.info('USER DISCONNECTED DUE TO INACTIVITY', userWithId)
    }, INACTIVITYTIMELIMIT);
    
    callback();
  });

  socket.on('message', (message) => {
    //write messages to file later
    logger.info('SERVER RECIEVED MESSAGE FROM A USER', message)


    if(inactivityTimeout) {
      clearTimeout(inactivityTimeout);

      inactivityTimeout = setTimeout(() => {
        ifUserInactive(message.name);
        logger.info('USER DISCONNECTED DUE TO INACTIVITY', {name:message.name, id:socket.id})
      }, INACTIVITYTIMELIMIT); 
    }

    socket.emit('message', { name: message.name, message: message.chatMessage, role: 'client' });
    socket.broadcast.to(CHATROOM).emit('message', { name: message.name, message: message.chatMessage, role: 'other' });

  })

  socket.on('leave_chat', ({user}, callback) => {
    logger.info('USER LEFT CHAT', user)

    socket.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message:`${user.name} has left the chat!`, role: 'admin',});
    socket.emit('leave_chat', {message: 'Hope you had fun, bye!'})
    socket.leave(CHATROOM);

    callback();
  })

  socket.on('disconnect', (reason) => {
    const user = findUserById(socket.id) || {name: ''};
    logger.info('USER GOT DISCONNECTED', user);
    
    socket.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: `${user.name} left the chat, connection lost`, role: 'admin',  disconnect: true});
    removeUser(socket.id);
    if(inactivityTimeout) {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = null;
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));

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