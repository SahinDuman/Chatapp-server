import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser'

import {giveUserSocketId, findUserById, removeUser }  from './users'
import router from './router';

const CHATROOM:string = 'chatroom';
const CHATBOT:string = 'BOT: Aslan';
const INACTIVITYTIMELIMIT:number = 60000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, { pingTimeout: INACTIVITYTIMELIMIT });

app.use(bodyParser.json())
app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  let inactivityTimeout: NodeJS.Timeout | null = null;

  const ifUserInactive = (name:string) => {

  console.log('USER INACTIVE!', name)

  socket.emit('inactive', {message: 'You got disconnected due to inactivity'});
  socket.leave(CHATROOM);
  socket.broadcast.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: `${name} was disconnected due to inactivity`});

  }


  socket.on('entered_chat', ({ user }, callback) => {
    const userWithId = giveUserSocketId(user.name, socket.id);
    socket.join(CHATROOM);
    
    socket.emit('adminMessage', { user: userWithId, name: CHATBOT, message: `Welcome to the chatroom ${user.name}!`, role: 'admin'});

    socket.broadcast.to(CHATROOM).emit('adminMessage', { name: CHATBOT, message: `${user.name} has joined the chat!`, role: 'admin'});

    inactivityTimeout = setTimeout(() => {
      ifUserInactive(user.name);
    }, INACTIVITYTIMELIMIT);
    
    callback();
  });

  socket.on('message', (message) => {
    //write messages to file later

    if(inactivityTimeout) {
      clearTimeout(inactivityTimeout);

      inactivityTimeout = setTimeout(() => {
        ifUserInactive(message.name);
      }, INACTIVITYTIMELIMIT); 
    }

    socket.emit('message', { name: message.name, message: message.message, role: 'client' });
    socket.broadcast.to(CHATROOM).emit('message', { name: message.name, message: message.message, role: 'other' });

  })

  socket.on('leave_chat', ({user}, callback) => {
    socket.to(CHATROOM).emit('adminMessage', { user: CHATBOT, text: `${user.name} has left the chat!` });
    socket.emit('leave_chat', {message: 'Hope you had fun, bye!'})
    socket.leave(CHATROOM);

    callback();
  })

  socket.on('disconnect', (reasonu) => {
    const {name} = findUserById(socket.id) || {name: ''};
    
    socket.to(CHATROOM).emit('adminMessage', { user: CHATBOT, text: `${name} left the chat, connection lost` });
    removeUser(socket.id);
    if(inactivityTimeout) {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = null;
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));