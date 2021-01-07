const WS_URL = "ws://" + location.hostname;
//const WS_URL = "ws://jetdave.ddns.net";

let socket = new WebSocket(WS_URL + ":81");
var nick;

socket.onopen = function(e) {
    console.log("[OPEN] Connection established");

    socket.send("nick:Admin");

    document.getElementsByTagName("header")[0].classList.add("connected");
};

var debug;
socket.onmessage = function(event) {
    var message = event.data;

    switch(requestType(message)){
        case 'ping':
            socket.send("pingResp:")
            break;
        case 'broadcast':
            alert(broadcastSender(message) + ": " + broadcastContent(message));
            break;
        case 'userList':
            console.log(requestContent(message));
            debug = requestContent(message);
            var userList = document.getElementById("userList");
            userList.innerHTML = "";
            for(var user of requestContent(message).split(';')){
                var lineAligner = document.createElement("div");
                var spanPing = document.createElement("span");
                var spanUsername = document.createElement("span");
                var spanVidTime = document.createElement("span");
                lineAligner.classList.add("lineAligner");
                spanUsername.classList.add("userName");
                spanPing.classList.add("ping");
                spanVidTime.classList.add("vidTime");
                spanUsername.innerHTML = user.split('-')[0];
                spanPing.innerHTML = user.split('-')[1] + " ms";
                spanVidTime.innerHTML = (user.split('-')[2]?getClockString(parseInt(user.split('-')[2])):"--:--.--");
                lineAligner.appendChild(spanUsername);
                lineAligner.appendChild(spanPing);
                lineAligner.appendChild(spanVidTime);
                userList.appendChild(lineAligner);
            }
            break;
        case "vidUrl":
            document.getElementById("inputVidUrl").value = requestContent(message);
            break;
        case 'videoControls':
            switch (requestContent(message).split('-')[0]) {
                case "play":
                    break;
                case "pause":
                    break;
                case "time":
                    //vid.currentTime = requestContent(message).split('-')[1];
                    break;
                case "fullscreen":
                    switch (requestContent(message).split('-')[1]) {
                        case "fullscreen":
                            console.log("[CONSOLE] Requested fullscreen");
                            break;
                        case "closeFullscreen":
                            console.log("[CONSOLE] Requested closeFullscreen");
                            break;
                    }
                    break;
            }
            break;
        case 'manualVid':
            console.log("[CONSOLE] Manual video controls");
            break;
        default:
            break;
    }
}
// p59 e p77
function getClockString(seconds){
    var hours = Math.floor(seconds/60/60);
    var mins = Math.floor(seconds/60) - hours*60;
    var sec = seconds - mins*60 - hours*60*60;

    return (hours<10?"0"+hours:hours) + ":" + (mins<10?"0"+mins:mins) + "." + (sec<10?"0"+sec:sec);
}
function broadcastCommand(type, content){
    socket.send(type+":"+content);
}
function enableManContr(){
    socket.send("manualVid:enableManContr");
}
function disableManContr(){
    socket.send("manualVid:disableManContr");
}
function playAllVids(){
    socket.send("videoControls:play");
}
function setAllFullscreen(force = ""){
    socket.send("videoControls:fullscreen-fullscreen");
}
function closeAllFullscreen(force = ""){
    socket.send("videoControls:fullscreen-closeFullscreen");
}
function pauseAllVids(){
    socket.send("videoControls:pause");
}
function messageToAll(txt){
    //fullscreenOFF();
    socket.send("broadcast:"+txt);
}
function manualStartAllVids(sec){
    socket.send("videoControls:pause");
    if(sec>=0){
        setTimeout(function(){
            socket.send("videoControls:time-"+sec);
        },250);
    }
    setTimeout(function(){
        socket.send("manualVid:play");
    },500);
}
function setAllVidsTime(sec){
    socket.send("videoControls:time-"+sec);
}
function startAllVids(sec){
    socket.send("videoControls:pause");
    if(sec>=0){
        setTimeout(function(){
            socket.send("videoControls:time-"+sec);
        },250);
    }
    setTimeout(function(){
        socket.send("videoControls:play");
    },500);
}

function sendVidUrl(url){
    socket.send("vidUrl:"+url);
}

function requestType(req){
    return req.split(':')[0];
}

function requestContent(req){
    return req.substring(req.indexOf(':')+1);
}

function broadcastSender(req){
    return requestContent(req).split('-')[0];
}

function broadcastContent(req){
    return requestContent(req).split('-')[1];
}

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log("[CLOSE] Connection closed cleanly, code=${event.code} reason=${event.reason}");
  } else {
    console.log("[CLOSE] Connection died");
  }

  document.getElementsByTagName("header")[0].classList.remove("connected");
  document.getElementsByTagName("header")[0].classList.add("disconnected");
  setTimeout(function(){
      location.reload();
  },100)
};

socket.onerror = function(error) {
  console.log("[ERROR] ${error.message}");
};
