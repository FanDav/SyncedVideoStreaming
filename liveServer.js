var PING_DELAY = 1; //pnig resolution in ms (milliseconds)
var PING_INTERVAL = 1; //seconds between every ping
const ENABLE_AUDIO_CHAT = false;
const ENABLE_HTML_SERVER = false;

const WebSocket = require('ws');
const path = require('path');
const express = require('express');
const http = require('http');
const https = require('https');
var app = express();
const fs = require('fs');
const url = require('url');
const dispatcher = require('./dispatcher');

var maxPing = 0;

if (ENABLE_AUDIO_CHAT) {
    const wsServer = new WebSocket.Server({ port: 82 }, () => console.log('Audio Chat Server listening on port 82'));
    let connectedClients = [];

    wsServer.on('connection', (ws, req) => {
        console.log('Connected user to Audio Chat');
        connectedClients.push(ws);
        ws.on('message', data => {
            connectedClients.forEach((client, i) => {
                if (client.readyState === client.OPEN) {
                    if (ws != client)
                        client.send(data);
                } else {
                    connectedClients.splice(i, 1);
                }
            });
        });
    });
}

if (ENABLE_HTML_SERVER) {
    let srvPort = 8088;
    
    http.createServer(function (request, response) {
        dispatcher.dispatch(request, response);
    }).listen(srvPort);
    console.log('Server running on port '+srvPort+'...');
    
    //dispatcher.showList();
    
    /*const httpServer = http.createServer(function (req, res) {
        replyToReq(req, res)
    });

    httpServer.listen(srvPort);
    console.log("HTTP server listening on port " + srvPort);

    app.get('/', replyToReq);
    

    function replyToReq(req, res) {
        let reqUrl = req.url != "/" ? req.url : "index.html";
        console.log(reqUrl);

        //res.header('Content-type', 'text/html');
        if (fs.existsSync(reqUrl)) {
            fs.readFile(reqUrl, function (err, data) {
                res.end(data)
                console.log(reqUrl, err, data);
            })
        }else{
            //console.log(res)
            res.end();
        }
    }*/
}

/*const server = https.createServer({
  cert: fs.readFileSync('ssl-cert/cert.crt'),
  key: fs.readFileSync('ssl-cert/cert.key')
});*/

const wss = new WebSocket.Server({
    port: 81,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
    //server
});
//server.listen(8080);

var pingIntervals = new Array;
var vidUrl;
var subUrls = [];
var audioChatRoomUrl;
var guestCounter = 0;

wss.on('connection', function connection(ws) {
    ws.nick = "Guest" + ++guestCounter;
    ws.delayHistory = new Array;

    setTimeout(function () {
        calcPing(wss.clients, ws);
    }, 250);
    ws.pingInterval = setInterval(function () {
        calcPing(wss.clients, ws);
    }, PING_INTERVAL * 1000);

    console.log("\n[CONNECT] Connected " + ws.nick + "");
    sendUserList(wss.clients, true);

    ws.on('close', function () {
        console.log("\n[DISCONNECT] " + ws.nick + " closed connection");
        clearInterval(ws.pingInterval);
        sendUserList(wss.clients, true);
        /*var jointConnections = "";
        for(var conn of wss.clients)
            jointConnections += conn.nick + "; ";
        console.log("\t[CONNECTIONS] " + jointConnections + "\n");*/
    })

    ws.on('message', function incoming(message) {

        switch (requestType(message)) {
            case 'vidUrl':
                vidUrl = requestContent(message);
                console.log("\n[VID URL] " + vidUrl + "");
                broadcastVidUrl(wss.clients, ws, vidUrl);
                /*path.exists(vidUrl,function(exists){
                    console.log("[SUB] Subtitles found: " + path.basename(vidUrl));
                });*/
                //console.log("[SUB] Subtitles found: " + path.basename(vidUrl));
                //console.log(path.dirname(path.dirname(vidUrl)));
                var parsedVidUrl = url.parse(vidUrl);
                var subCheckPath = parsedVidUrl.path.replace(/\.[^/.]+$/, "") + ".vtt";
                if (fs.existsSync("../" + subCheckPath)) {
                    var subUrl = (parsedVidUrl.protocol + "//" + parsedVidUrl.host + subCheckPath);
                    subUrls.push(subUrl);
                    console.log("[SUB] Subtitles found: " + subUrl);
                    broadcast(wss.clients, ws, "subUrl", subUrls[0]);
                }
                break;
            case 'audioChatUrl':
                audioChatRoomUrl = requestContent(message);
                console.log("\n[AUDIOCHAT URL] " + audioChatRoomUrl + "\n");
                broadcast(wss.clients, ws, "audioChatUrl", audioChatRoomUrl);
                break;
            case 'nick':
                console.log("[NICK UPDATE] " + ws.nick + " is now " + requestContent(message) + "\n");
                ws.nick = requestContent(message);
                if (vidUrl) {
                    ws.send("vidUrl:" + vidUrl);
                    broadcast(wss.clients, ws, "subUrl", subUrls[0]);
                    //ws.send("videoControls:pause");
                }
                break;
            case 'broadcast':
                wsBroadcast(wss.clients, ws, requestContent(message));
                console.log("[MESSAGE TO ALL] Sending: " + requestContent(message));
                break;
            case 'videoControls':
                syncVideoControls(wss.clients, ws, requestContent(message));
                break;
            case 'manualVid':
                broadcast(wss.clients, ws, "manualVid", requestContent(message));
                break;
            case 'pingResp':
                clearInterval(ws.pingInt);
                ws.videoTime = requestContent(message);
                if (ws.delay < 5000 && ws.delay > maxPing) {
                    maxPing = ws.delay;
                }
                ws.delayHistory.push(ws.delay);
                if (ws.delayHistory.length > 5)
                    ws.delayHistory.shift();
                //console.log("[PING] " + ws.nick + ": " + ws.delay + " ms    -    Avg: " + calcAvg(ws.delayHistory) + " ms    -    Max: " + maxPing + " ms");
                sendUserList(wss.clients, true);
                break;
            default:
                break;
        }
    });


});

function sendUserList(origUsers, toEveryone = false) {
    var users = new Array;
    for (var user of origUsers) {
        users.push(user);
    }
    users.sort(compareNames);

    var jointString = "";
    for (var user of users)
        jointString += user.nick + "-" + user.delay + "-" + user.videoTime + ";";
    jointString = jointString.substring(0, jointString.length - 1);

    for (var user of users) {
        if (user.nick.toUpperCase() == "ADMIN" || toEveryone) {
            user.send("userList:" + jointString)
        }
    }
}

function broadcast(conns, sender, type, content, senderFilter = false) {
    for (var conn of conns) {
        if (!(senderFilter && ws == conn)) {
            conn.send(type + ":" + content);
        }
    }
}

function broadcastVidUrl(conns, sender, txt) {
    for (var conn of conns) {
        conn.send("vidUrl:" + txt);
    }
}

function calcPing(connections, ws) {
    ws.delay = 0;
    ws.send('ping:0');
    ws.pingInt = setInterval(function () {
        ws.delay += PING_DELAY;
    }, PING_DELAY);
}

function wsBroadcast(conns, sender, txt) {
    for (var conn of conns) {
        if (conn != sender)
            conn.send("broadcast:" + ((sender.nick) ? (sender.nick + "-") : "") + txt);
    }
}

function compareNames(a, b) {
    if (a.nick.toUpperCase() < b.nick.toUpperCase()) {
        return -1;
    }
    if (a.nick.toUpperCase() > b.nick.toUpperCase()) {
        return 1;
    }
    return 0;
}

function compare(a, b) {
    if (a.delay < b.delay) {
        return -1;
    }
    if (a.delay > b.delay) {
        return 1;
    }
    return 0;
}

function syncVideoControls(conns, sender, txt) {
    var alreadySent = new Array();
    var jointConnections = "";

    for (var conn of wss.clients)
        jointConnections += conn.nick + "; ";

    console.log("\n[STATUS] Sending synced video control to " + jointConnections + "\n");

    curMill = getMaxDelay(conns) + 10;

    var i = conns.length - 1;
    var senderInterval = setInterval(function () {
        for (var conn of conns) {
            if (curMill <= calcAvg(conn.delayHistory) && !alreadySent.includes(conn)) {
                console.log("[COMMAND] Sending synced command to: " + conn.nick);
                conn.send("videoControls:" + txt);
                alreadySent.push(conn);
            }
        }
        if (curMill <= 0 || alreadySent.length == conns.length) {
            clearInterval(senderInterval);
        }

        curMill--;
    }, 1);
}

function getMaxDelay(connections) {
    var max = 0;

    for (var conn in connections) {
        if (conn.delay > max)
            max = conn.delay;
    }

    return max;
}

function requestType(req) {
    return req.split(':')[0];
}
function requestContent(req) {
    return req.substring(req.indexOf(':') + 1);
}

function calcAvg(valArr) {
    var somma = 0;
    for (var val of valArr)
        somma += val;

    var media = Math.round(somma / valArr.length);

    return media;
}
function contains(array, value) {
    try {
        for (var check of array) {
            if (check == value)
                return true;
        }
    } catch (e) { }
    return false;
}
