import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser'

import {giveUserSocketId, removeUser }  from './users'
import router from './router';

const CHATROOM:string = 'chatroom';
const CHATBOT:string = 'Aslan';
const INACTIVITYTIMELIMIT:number = 10000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, { pingTimeout: INACTIVITYTIMELIMIT });

app.use(bodyParser.json())
app.use(cors());
app.use(router);



io.on('connect', (socket) => {

  socket.on('entered_chat', ({ user }, callback) => {
    const userWithId = giveUserSocketId(user.name, socket.id);
    socket.join(CHATROOM);
    
    socket.emit('adminMessage', { user: userWithId, name: `Admin: ${CHATBOT}`, message: `$Welcome to the chatroom ${user.name}!`, role: 'admin'});

    socket.broadcast.to(CHATROOM).emit('adminMessage', { name: `Admin: ${CHATBOT}`, message: `${user.name} has joined the chat!`, role: 'admin'});
    
    callback();
  });

  socket.on('message', (message) => {
    //write messages to file later
    console.log('message:::', message);

    socket.emit('message', { name: message.name, message: message.message, role: 'client' });
    socket.broadcast.to(CHATROOM).emit('message', { name: message.name, message: message.message, role: 'other' });
  })

  socket.on('leave_chat', ({user}, callback) => {
    socket.emit('leave_chat', {message: 'You left the chat!'})
    socket.leave(CHATROOM);
    socket.to(CHATROOM).emit('adminMessage', { user: `Admin: ${CHATBOT}`, text: `${user.name} has left the chat!` });

    callback();
  })

/*   socket.on('disconnect', (reason) => {
    let userMessage;
    let chatroomMessage;
    console.log(reason);

    if(reason === 'ping timeout') {
      userMessage = 'You got disconnected from the chat due to inactivity';
      chatroomMessage = `was disconnected from the chat due to inactivity`;
    } else {
      userMessage = 'You got disconnected from the chat';
      chatroomMessage = ` was disconnected from the chat`;
    }

    socket.emit('disconnect', { message: userMessage });
    socket.leave(CHATROOM);
    socket.to(CHATROOM).emit('adminMessage', { user: `Admin: ${CHATBOT}`, text: chatroomMessage });
  }) */
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));