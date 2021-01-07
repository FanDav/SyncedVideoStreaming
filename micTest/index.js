const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const app = express();

const HTTP_PORT = process.env.HTTP_PORT || 3000;

app.get('/client', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client.html'));
});
app.get('/streamer', (req, res) => {
    res.sendFile(path.resolve(__dirname, './streamer.html'));
});

app.listen(HTTP_PORT, () => {
    console.log(`HTTP server listening at http://localhost:${HTTP_PORT}`)
});
