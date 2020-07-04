import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser'

import { addUser }  from './users'
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

  socket.on('entered_chat', ({ name }, callback) => {
    socket.join(CHATROOM);

    socket.emit('adminMessage', { user: `Admin: ${CHATBOT}`, text: `$Welcome to the chatroom ${name}!` });
    socket.broadcast.to(name).emit('adminMessage', { user: `Admin: ${CHATBOT}`, text: `${name} has joined the chat!` });

    callback();
  });


});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));