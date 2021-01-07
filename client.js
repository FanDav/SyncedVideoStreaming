const WS_URL = "ws://" + location.hostname;
//const WS_URL = "wss://radiant-spire-53822.herokuapp.com/";
//const WS_URL = "ws://jetdave.ddns.net";
const ENABLE_AUDIO_CHAT = false;

var nick;
var socket;
var audioWS
var reconInt = [];

init();

function init() {
    if (get("nick")) {
        connectWebsockets();
    }

    if (ENABLE_AUDIO_CHAT) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (audioWS) {
            audioWS.onopen = function () {
                //console.log(`Connected to Audio Chat socket`);
                navigator.getUserMedia({ audio: true }, gotStream, function () { console.log("Error navigator.getUserMedia") });
                //navigator.mediaDevices.getUserMedia( {audio:true}, gotStream, function(){console.log("Error navigator.getUserMedia")});

                /*navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function(stream) {
                    alert('You let me use your mic!')
                })
                .catch(function(err) {
                    alert('No mic for you!')
                });*/
            }
            audioWS.onmessage = function (message) {
                console.log(message.data)
                audioStream.src = message.data;
                audioStream.play();
            }
        }

        var reader = new window.FileReader();

        var base64data;
        var saveBase64data;
        reader.onloadend = function () {
            var fd = new FormData();
            base64data = reader.result;
        }


        var analyser;
        function gotStream(stream) {
            const mediaRecorder = new MediaRecorder(stream);
            var audioContext = new AudioContext();

            var mediaStreamSource = audioContext.createMediaStreamSource(stream);

            analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;

            mediaStreamSource.connect(analyser);

            setInterval(function () {
                if (analyser) {
                    var data = new Uint8Array(256);
                    analyser.getByteFrequencyData(data);

                    var volMid = 0;

                    for (var i = 0; i < 256; i++) { volMid += data[i] }

                    volMid /= i;
                    volMid = Math.round(volMid);


                    if (volMid > 22 && saveBase64data != base64data) {
                        console.log("parlando: " + volMid)
                        sendDatatoWs(base64data);
                        saveBase64data = base64data;
                    }
                }
            }, 10);

            mediaRecorder.start();
            setInterval(function () {
                mediaRecorder.stop();
                mediaRecorder.start();
            }, 250);

            mediaRecorder.ondataavailable = function (e) {
                reader.readAsDataURL(e.data);
            }

        }

        function sendDatatoWs(bs64) {
            audioWS.send(bs64)
            console.log("data sent")
        }
    }
}

var audioStream = new Audio();

function connectWebsockets() {
    if (socket)
        socket.close();
    if (audioWS)
        audioWS.close();

    socket = new WebSocket(WS_URL + ":81");
    if (ENABLE_AUDIO_CHAT)
        audioWS = new WebSocket(WS_URL + ":82");

    if (socket) {
        socket.onopen = function (e) {
            //console.log("[open] Connection established");
            /*while (reconInt[0])
                clearInterval(reconInt.pop());*/

            nick = get("nick");
            if (nick)
                socket.send("nick:" + nick);

            document.getElementsByTagName("header")[0].classList.remove("disconnected");
            document.getElementsByTagName("header")[0].classList.add("connected");
        };

        socket.onmessage = function (event) {
            var message = event.data;
            /*console.log('Tipo richiesta: ' + requestType(message));
            console.log('Contenuto richiesta: ' + requestContent(message) + "\n");*/

            if (message.trim() != "") {
                switch (requestType(message)) {
                    case 'ping':
                        socket.send("pingResp:" + (vid.currentSrc != "" ? vid.currentTime : ""));
                        break;
                    case 'audioChatUrl':
                        window.open(requestContent(message));
                        break;
                    case 'broadcast':
                        alert(broadcastSender(message) + ": " + broadcastContent(message));
                        console.log("[MESSAGE TO ALL] " + broadcastSender(message) + ": " + broadcastContent(message));
                        break;
                    case "vidUrl":
                        if (get("nick")) {
                            console.log("Setting video url " + requestContent(message));
                            setTimeout(function () {
                                setVideoUrl(requestContent(message));
                            }, 100)
                        }
                        break;
                    case "subUrl":
                        if (get("nick")) {
                            console.log("Setting subtitles url " + requestContent(message));
                            setTimeout(function () {
                                addVideoSub(requestContent(message));
                            }, 0)
                        }
                        break;
                    case 'userList':
                        //console.log(requestContent(message));
                        debug = requestContent(message);
                        var userList = document.getElementById("clientUsersList").getElementsByClassName("verticalList")[0];
                        userList.innerHTML = "";
                        for (var user of requestContent(message).split(';')) {
                            if (user.split('-')[0].toUpperCase() != "ADMIN") {
                                var lineAligner = document.createElement("div");
                                var spanUsername = document.createElement("span");
                                //var spanVidTime = document.createElement("span");
                                lineAligner.classList.add("lineAligner");
                                spanUsername.classList.add("userName");
                                //spanVidTime.classList.add("vidTime");
                                spanUsername.innerHTML = user.split('-')[0];
                                //spanVidTime.innerHTML = (user.split('-')[2]?getClockString(parseInt(user.split('-')[2])):"--:--.--");
                                lineAligner.appendChild(spanUsername);
                                //lineAligner.appendChild(spanVidTime);
                                userList.appendChild(lineAligner);
                            }
                        }
                        break;
                    case 'videoControls':
                        switch (requestContent(message).split('-')[0]) {
                            case "play":
                                //alert("play");
                                vid.focus();
                                var playCheck = vid.play();
                                if (playCheck !== undefined) {
                                    playCheck.then(_ => {
                                        console.log("Video started");
                                    }).catch(error => {
                                        console.log("Autoplay prevented");
                                    });
                                }
                                break;
                            case "pause":
                                //alert("pause");
                                vid.focus();
                                vid.pause();
                                console.log("Video paused");
                                break;
                            case "time":
                                vid.currentTime = requestContent(message).split('-')[1];
                                vid.pause();
                                break;
                            case "fullscreen":
                                var elem = vid.parentNode;
                                switch (requestContent(message).split('-')[1]) {
                                    case "fullscreen":
                                        if (elem.requestFullscreen) {
                                            elem.requestFullscreen();
                                        } else if (elem.mozRequestFullScreen) { /* Firefox */
                                            elem.mozRequestFullScreen();
                                        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                                            elem.webkitRequestFullscreen();
                                        } else if (elem.msRequestFullscreen) { /* IE/Edge */
                                            elem.msRequestFullscreen();
                                        }
                                        break;
                                    case "closeFullscreen":
                                        fullscreenOFF();
                                        if (mobilecheck())
                                            alert("Tocca una volta sul video per permettere il corretto funzionamento della sincronizzazione!");
                                        break;
                                }
                                break;
                        }
                        break;
                    case 'manualVid':
                        switch (requestContent(message).split('-')[0]) {
                            case "play":
                                enableVideoButtons();
                                countdownMsg(5, "Avviare manualmente il video fra: ");
                                break;
                            case "enableManContr":
                                enableVideoButtons();
                                break;
                            case "disableManContr":
                                disableVideoButtons();
                                break;
                            default:
                                console.log("[ERROR] ManualVid probable error");
                                break;
                        }
                        break;
                    default:
                        break;
                }
            }

        }

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log("[close] Connection closed cleanly, code=${event.code} reason=${event.reason}");
            } else {
                console.log("[close] Connection died");

                setTimeout(function () {
                    connectWebsockets();
                }, 100)
            }

            document.getElementsByTagName("header")[0].classList.remove("connected");
            document.getElementsByTagName("header")[0].classList.add("disconnected");
        };

        socket.onerror = function (error) {
            console.log(error);
        };
    }
}



function fullscreenOFF() {
    if ((document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

function playAllVids() {
    startAllVids(vid.currentTime);
}
function setAllFullscreen(force = "") {
    socket.send("videoControls:fullscreen-fullscreen");
}
function closeAllFullscreen(force = "") {
    socket.send("videoControls:fullscreen-closeFullscreen");
}
function pauseAllVids() {
    socket.send("videoControls:pause");
}
function messageToAll(txt) {
    //fullscreenOFF();
    socket.send("broadcast:" + txt);
}
function manualStartAllVids(sec) {
    socket.send("videoControls:pause");
    setTimeout(function () {
        socket.send("videoControls:time-" + sec);
    }, 250);
    setTimeout(function () {
        socket.send("manualVid:play");
    }, 500);
}
function setAllVidsTime(sec) {
    socket.send("videoControls:time-" + sec);
}
function startAllVids(sec) {
    socket.send("videoControls:pause");
    setTimeout(function () {
        socket.send("videoControls:time-" + sec);
    }, 250);
    setTimeout(function () {
        socket.send("videoControls:play");
    }, 500);
}

function sendVidUrl(url) {
    socket.send("vidUrl:" + url);
}

function requestType(req) {
    return req.split(':')[0];
}
function requestContent(req) {
    return req.substring(req.indexOf(':') + 1);
}

function broadcastSender(req) {
    return requestContent(req).split('-')[0];
}

function broadcastContent(req) {
    return requestContent(req).split('-')[1];
}
