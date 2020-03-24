var PING_DELAY = 1; //pnig resolution in ms (milliseconds)
var PING_INTERVAL = 5; //seconds between every ping

const WebSocket = require('ws');
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');

var privateKey = fs.readFileSync('whispering-brook-38329_herokuapp_com.key', 'utf8');
var certificate = fs.readFileSync('whispering-brook-38329_herokuapp_com.csr', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var https = require('https');

var httpsServer = https.createServer(credentials);
httpsServer.listen(81);

var httpsServer2 = https.createServer(credentials);
httpsServer.listen(82);

var maxPing = 0;
  
//const wsServer = new WebSocket.Server({ port: 82 }, () => console.log('Audio Chat Server listening on port 82'));
const wsServer = new WebSocket.Server({
    server: httpsServer2;
});

let connectedClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected user to Audio Chat');
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

const wss = new WebSocket.Server({
    server: httpsServer;
    /*port: 81,
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
    }*/
});

var pingIntervals = new Array;
var vidUrl;
var guestCounter = 0;

wss.on('connection', function connection(ws) {
    ws.nick = "Guest" + ++guestCounter;
    ws.delayHistory = new Array;

    setTimeout(function(){
        calcPing(wss.clients,ws);
    },250);
    ws.pingInterval = setInterval(function(){
        calcPing(wss.clients,ws);
    },PING_INTERVAL*1000);

    console.log("\n[CONNECTION] Connected " + ws.nick + "");

    ws.on('close',function(){
        console.log("\n[DIE] " + ws.nick + " closed connection");
        clearInterval(ws.pingInterval);
        /*var jointConnections = "";
        for(var conn of wss.clients)
            jointConnections += conn.nick + "; ";
        console.log("\t[CONNECTIONS] " + jointConnections + "\n");*/
    })

    ws.on('message', function incoming(message) {

        switch(requestType(message)){
            case 'vidUrl':
                vidUrl = requestContent(message);
                console.log("\n[VID URL] "+ vidUrl + "\n");
                broadcastVidUrl(wss.clients, ws, vidUrl);
                break;
            case 'nick':
                console.log("[NICK UPDATE] " + ws.nick + " is now " + requestContent(message) + "\n");
                ws.nick = requestContent(message);
                if(vidUrl){
                    ws.send("vidUrl:" + vidUrl);
                    //ws.send("videoControls:pause");
                }
                break;
            case 'broadcast':
                wsBroadcast(wss.clients, ws, requestContent(message));
                break;
            case 'videoControls':
                syncVideoControls(wss.clients, ws, requestContent(message));
                break;
            case 'manualVid':
                broadcast(wss.clients, ws, "manualVid",requestContent(message));
                break;
            case 'pingResp':
                clearInterval(ws.pingInt);
                if(ws.delay < 5000 && ws.delay > maxPing){
                    maxPing = ws.delay;
                }
                ws.delayHistory.push(ws.delay);
                if(ws.delayHistory.length > 5)
                    ws.delayHistory.shift();
                //console.log("[PING] " + ws.nick + ": " + ws.delay + " ms    -    Avg: " + calcAvg(ws.delayHistory) + " ms    -    Max: " + maxPing + " ms");
                sendUserList(wss.clients);
                break;
            default:
                break;
        }
    });


});

function sendUserList(origUsers){
    var users = new Array;
    for(var user of origUsers){
        users.push(user);
    }
    users.sort(compareNames);

    var jointString = "";
    for(var user of users)
        jointString += user.nick + "-" + user.delay + ";";
    jointString = jointString.substring(0,jointString.length-1);

    for(var user of users){
        if(user.nick.toUpperCase() == "ADMIN"){
            user.send("userList:" + jointString)
        }
    }
}

function broadcast(conns, sender, type, content, senderFilter=false){
    for(var conn of conns){
        if(!(senderFilter && ws==conn)){
            conn.send(type + ":" + content);
        }
    }
}

function broadcastVidUrl(conns, sender, txt){
    for(var conn of conns){
        conn.send("vidUrl:" + txt);
    }
}

function calcPing(connections, ws){
    ws.delay = 0;
    ws.send('ping:0');
    ws.pingInt = setInterval(function(){
        ws.delay += PING_DELAY;
    },PING_DELAY);
}

function wsBroadcast(conns, sender, txt){
    for(var conn of conns){
        if(conn != sender)
            conn.send("broadcast:" + sender.nick + "-" + txt);
    }
}

function compareNames( a, b ) {
  if ( a.nick.toUpperCase() < b.nick.toUpperCase() ){
    return -1;
  }
  if ( a.nick.toUpperCase() > b.nick.toUpperCase() ){
    return 1;
  }
  return 0;
}

function compare( a, b ) {
  if ( a.delay < b.delay ){
    return -1;
  }
  if ( a.delay > b.delay ){
    return 1;
  }
  return 0;
}

function syncVideoControls(conns, sender, txt){
    var alreadySent = new Array();
    var jointConnections = "";

    for(var conn of wss.clients)
        jointConnections += conn.nick + "; ";

    console.log("\n[STATUS] Sending synced video control to " + jointConnections + "\n");

    curMill = getMaxDelay(conns)+10;

    var i = conns.length-1;
    var senderInterval = setInterval(function(){
        for(var conn of conns){
            if(curMill <= calcAvg(conn.delayHistory) && !alreadySent.includes(conn)){
                console.log("[COMMAND] Sending synced command to: " + conn.nick);
                conn.send("videoControls:" + txt);
                alreadySent.push(conn);
            }
        }
        if(curMill<=0 || alreadySent.length == conns.length){
            clearInterval(senderInterval);
        }

        curMill--;
    },1);

    /*i=toSend.length-1;
    var vidContrInt = setInterval(function(){
        if(i>=0 && toSend[i].delay >= curMill){
            //console.log("[COMMAND] Sending to " + toSend[i].nick);
            toSend[i].send("videoControls:" + txt);
            reqRemaining--;
            i--;
        }
        curMill--;
        if(reqRemaining==0 || curMill==0)
            clearInterval(vidContrInt);
    },1)*/
}

function getMaxDelay(connections){
    var max = 0;

    for(var conn in connections){
        if(conn.delay>max)
            max = conn.delay;
    }

    return max;
}

function requestType(req){
    return req.split(':')[0];
}

function requestContent(req){
    return req.substring(req.indexOf(':')+1);
}

function calcAvg(valArr){
    var somma = 0;
    for(var val of valArr)
        somma += val;

    var media = Math.round(somma/valArr.length);

    return media;
}
function contains(array, value){
    try {
        for(var check of array){
            if(check == value)
                return true;
        }
    } catch (e) {}
    return false;
}
