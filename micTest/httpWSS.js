const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const app = express();

const WS_PORT = process.env.WS_PORT || 3001;
const HTTP_PORT = process.env.HTTP_PORT || 3000;

const wsServer = new WebSocket.Server({ port: WS_PORT }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));

let connectedClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    connectedClients.push(ws);
    ws.on('message', data => {
        connectedClients.forEach((client, i) => {
            if (client.readyState === client.OPEN) {
                if(ws!=client)
                    client.send(data);
            } else {
                connectedClients.splice(i, 1);
            }
        });
    });
});

// HTTP stuff
app.get('/client', (req, res) => res.sendFile(path.resolve(__dirname, './client.html')));
app.get('/streamer', (req, res) => res.sendFile(path.resolve(__dirname, './streamer.html')));
app.listen(HTTP_PORT, () => console.log(`HTTP server listening at http://localhost:${HTTP_PORT}`));
