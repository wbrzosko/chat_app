import express from 'express';
import socket from 'socket.io';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config';
import { Server } from 'http' 

// Setting up the server for Back-End
const port = 8080;
const app = express();
const server = Server(app);
const io = socket(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + './../public/index.html'));
});

// Declaring socket.io message handling
io.on('connection', (socket) => {
    console.log('A user connected.');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
    socket.on ('message', (data) => {
        console.log('data.message: '+data.message+ ', data.username: ' +data.username);
        socket.broadcast.emit('message', data);
    })
    socket.on ('login', (user) => {
        socket.broadcast.emit('message', {message: `* ${user } joined the chat`, username: ''})
        console.log('login' + user)
    })
});

// Launching http server
server.listen(port, (err) => {
    if (err) {
        console.log('error', err); 
    }
    else {
        console.log(`Listening on localhost:${port}`);
        open(`http://localhost:${port}`)
    }
});

// Starting Webpack for Front-End
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

