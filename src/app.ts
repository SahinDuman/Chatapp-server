import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser'

import {giveUserSocketId, removeUser }  from './users'
import router from './router';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json())
app.use(cors());
app.use(router);

const CHATROOM:string = 'chatroom';
const CHATBOT:string = 'Aslan';
const INACTIVITYTIMELIMIT:number = 60000; //1 minute

io.on('connect', (socket) => {

  socket.on('entered_chat', ({ user }, callback) => {
    const userWithId = giveUserSocketId(user.name, socket.id);
    socket.join(CHATROOM);
    
    console.log('USER WITH ID', userWithId);

    socket.emit('adminMessage', { user: userWithId, admin: `Admin: ${CHATBOT}`, text: `$Welcome to the chatroom ${user.name}!` });

    socket.broadcast.to(CHATROOM).emit('adminMessage', { user: `Admin: ${CHATBOT}`, text: `${user.name} has joined the chat!` });
    
    callback();
  });

  socket.on('leave_chat', ({user}, callback) => {
    socket.emit('leave_chat', {message: 'You left the chat!'})
    socket.leave(CHATROOM);
    socket.to(CHATROOM).emit('adminMessage', { user: `Admin: ${CHATBOT}`, text: `${user.name} has left   the chat!` });
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));