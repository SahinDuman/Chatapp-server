import express, {Application, Request, Response} from 'express';
import http from 'http';
import socketio from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './router';
import {addUser} from './users'

const app: Application = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(bodyParser.json())
app.use(router);

//GLOBAL CONFIGURABLE VARIABLES
const CHATROOM:string = 'chatroom';
const CHATBOT:string = 'Aslan';
const INACTIVITYTIMELIMIT:number = 60000; //1 minute
//-------------------------------------------------

/* io.on('connect', (socket) => {
  socket.on('enteringChat', ({name}, callback) => {
    const {error, newUser} = addUser({name, id: socket.id});

    if(error) return callback(error);

    socket.join(CHATROOM);
    //socket.emit('adminMessage', {admin: `ADMIN: ${CHATBOT}`, message: `${newUser?.name || ''} has joined the chat. Hello friend!`});
    socket.broadcast.to(CHATROOM).emit('adminMessage', {admin: `ADMIN: ${CHATBOT}`, message: `${newUser?.name || ''} has joined the chat. Hello friend!`});

    callback();
  })
}) */

app.listen(process.env.PORT || 5000, () => console.log('server running'));