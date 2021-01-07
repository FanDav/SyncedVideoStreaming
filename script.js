var header;
var body;
var footer;
var wrapper;
var vids;
var vid;
var lastMouseMove = new Date();

window.onload = function(){
    header = document.getElementsByTagName("header")[0];
    body = document.getElementsByTagName("body")[0];
    footer = document.getElementsByTagName("footer")[0];
    wrapper = document.getElementById("wrapper");

    if(get("nick")){
        appendVideo("");
    }

    if(!get("nick"))
    popUp("Inserire il nickname","nick","Nickname");

    if(mobilecheck()){
        wrapper.style.padding = "25px";
        wrapper.style.width = "calc(100% - 50px)";
        wrapper.style.maxHeight = "calc(100% - " + (document.getElementsByTagName("footer")[0].offsetHeight + document.getElementsByTagName("header")[0].offsetHeight + 50) + "px)";
    }


}

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function setVideoUrl(url){
    if(url.trim()!="" && vid){
        var source1 = vid.getElementsByTagName("source")[0];
        var source2 = vid.getElementsByTagName("source")[1];

        source1.src = url;
        source1.type = "video/mp4";

        var src2url = url.substring(0,url.length-4) + ".ogg";
        source2.src = src2url;
        source2.type = "video/ogg";

        vid.load();
        vid.pause();

        document.getElementById("videoContainer").hidden = false;
    }
}
function addVideoSub(url){
    if(url.trim()!="" && vid){
        var video = document.querySelector("video");
        var subtitles = document.createElement("track");
        
        subtitles.label = "English";
        subtitles.kind = "subtitles";
        subtitles.srcland = "en";
        subtitles.src = url;
        subtitles.default = true;
            
        video.appendChild(subtitles);
    }
}

function detectResolution(){
    vids = document.getElementsByClassName("vid");

    for(var v of vids){
        console.log(v.getAttribute("href"));
    }
}

var tmpUrl;
function appendVideo(url){
    var videoContainer = document.createElement("div");
    var videoControls = document.createElement("div");
    var video = document.createElement("video");
    var source1 = document.createElement("source");
    var source2 = document.createElement("source");
    var fullScreenBtn = document.createElement("button");
    var timebar = document.createElement("input");
    var vidTime = document.createElement("div");
    var audioRecording = document.createElement("button");
    var iconUrl = "https://cdn1.iconfinder.com/data/icons/material-core/14/fullscreen-512.png";
    var subtitles = document.createElement("track");

    tmpUrl = new URL(location.href);

    subtitles.label = "English";
    subtitles.kind = "subtitles";
    subtitles.srcland = "en";
    subtitles.default = true;
    
    //subtitles.src = "http://" + tmpUrl.hostname + "/Mr.%20Robot/Season%201%20Eng%20Sub/02eng.vtt";
    //subtitles.src = "http://" + tmpUrl.hostname + "/The.Social.Dilemma/2_English.vtt";
    subtitles.src = "http://fantinodavide.it/Disconnect/Disconnect.vtt";
    
    timebar.id = "timebar";
    timebar.type = "range";
    timebar.disabled = true;

    vidTime.innerHTML = "--:--.-- / --:--.--";
    vidTime.id = "vidTime";

    if(video.offsetWidth>video.offsetHeight){
        video.style.height = "100%";
    }
    else {
        video.style.width = "100%";
    }

    var videoTag = document.getElementById("videoContainer");
    if(videoTag)
    videoTag.parentNode.removeChild(videoTag);

    video.controls = false;
    video.classList.add("noControls");
    videoControls.style.display = "flex";

    videoContainer.id = "videoContainer";
    videoControls.id = "videoControls";

    //fullScreenBtn.style.background = 'url('+iconUrl+')';
    video.addEventListener("timeupdate",function(){
        var innerTimebar = document.getElementById("timebar") || timebar;
        vidTime.innerHTML = getClockString(video.currentTime) + " / " + getClockString(video.duration || 0);
        innerTimebar.value = Math.floor(video.currentTime);
        timebar.max = video.duration;
    })
    if(!mobilecheck()){
        videoContainer.addEventListener("mouseover",function(){
            if(!video.hasAttribute("controls")){
                videoControls.classList.add("hover");
            }
        });
        videoContainer.addEventListener("mouseout",function(){
            if(!video.hasAttribute("controls"))
            videoControls.classList.remove("hover");
        });
    }
    videoContainer.addEventListener("click",function(){
        if(!video.hasAttribute("controls")){
            videoControls.classList.add("hover");
            setTimeout(function(){
                videoControls.classList.remove("hover");
            },2000)
        }
    });
    document.addEventListener("mousemove",function(){
        lastMouseMove = new Date();
        wrapper.style.cursor = "inherit";
        document.getElementById("videoControls").classList.add("hover");
        if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement){
            setTimeout(function(){
                var now = new Date();
                if(now-lastMouseMove>2000){
                    wrapper.style.cursor = "none";
                    videoControls.classList.remove("hover");
                }
            },2000);
        }
    });

    fullScreenBtn.classList.add("fullScreenBtn");
    fullScreenBtn.addEventListener("click",function(){
        vidFullscreen(vid.parentNode);
    });

    audioRecording.classList.add("audioRecordingBtn");
    audioRecording.addEventListener("click",function(){
        navigator.getUserMedia( {audio:true}, gotStream, function(){console.log("Error navigator.getUserMedia")});
    })

    source1.type = "video/mp4";
    source2.type = "video/ogg";

    if(url!=""){
        source1.src = url;
        var src2url = url.substring(0,url.length-4) + ".ogg";
        source2.src = src2url;
    }

    video.appendChild(source1);
    video.appendChild(source2);
    //video.appendChild(subtitles);
    videoContainer.appendChild(video);
    videoContainer.appendChild(videoControls);
    videoControls.appendChild(vidTime);
    videoControls.appendChild(timebar);
    videoControls.appendChild(fullScreenBtn);
    //videoControls.appendChild(audioRecording);

    var error = false;

    try {
        wrapper.appendChild(videoContainer);
        videoContainer.hidden = true;
    } catch (e) {
        alert("Si è verificato un errore.");
        error = true;
    } finally {
        if(mobilecheck()){
            alert("Tocca una volta sul video per permettere il corretto funzionamento della sincronizzazione!");
        }
    }

    vid = video;
}

function getClockString(seconds){
    seconds = Math.floor(seconds);
    var hours = Math.floor(seconds/60/60);
    var mins = Math.floor(seconds/60) - hours*60;
    var sec = seconds - mins*60 - hours*60*60;

    return (hours<10?"0"+hours:hours) + ":" + (mins<10?"0"+mins:mins) + "." + (sec<10?"0"+sec:sec);
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

function vidFullscreen(elem, force=false) {
    if(!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)){
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }else{
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

    elem.controls = false;
}

function playVid() {
    vid.play();
}

function pauseVid() {
    vid.pause();
}

function disableVideoButtons(){
    vid.controls = false;
    vid.classList.add("noControls");
    videoControls.style.display = "flex";
}
function enableVideoButtons(){
    vid.controls = true;
    vid.classList.remove("noControls");
    videoControls.style.display = "none";
}

function countdownMsg(startSec, txt){
    var popUp = document.createElement("div");
    var popUpTitle = document.createElement("h2");
    var countdown = document.createElement("h1");

    popUp.classList.add("popUp");

    popUpTitle.innerHTML = txt;
    countdown.innerHTML = startSec;

    popUp.appendChild(popUpTitle);
    popUp.appendChild(countdown);
    wrapper.appendChild(popUp);

    var countdownInt = setInterval(function(){
        countdown.innerHTML = parseInt(countdown.innerHTML)-1;

        if(parseInt(countdown.innerHTML)==0){
            clearInterval(countdownInt);
            wrapper.removeChild(popUp);
        }
    },1000)
}

function popUp(title, campo, placeholder){
    var popUp = document.createElement("div");
    var form = document.createElement("form");
    var popUpTitle = document.createElement("h2");
    var saveGet = document.createElement("input")
    var input = document.createElement("input");
    var submit = document.createElement("input");

    if(get("nick") && campo!="nick"){
        saveGet.type = "text";
        saveGet.name = "nick";
        saveGet.value = get("nick");
    }else if(get("vidUrl") && campo!="vidUrl"){
        saveGet.type = "text";
        saveGet.name = "vidUrl";
        saveGet.value = get("vidUrl");
    }
    saveGet.hidden = true;

    popUp.classList.add("popUp");

    popUpTitle.innerHTML = title;

    form.action = "./"
    form.method = "get"

    input.type = "text";
    input.name = campo;
    input.required = true;
    input.placeholder = placeholder;

    submit.type = "submit";
    submit.value = "Invia";

    popUp.style.zIndex = 50;

    popUp.appendChild(popUpTitle);
    popUp.appendChild(form);
    form.appendChild(input);
    //form.appendChild(saveGet);
    form.appendChild(submit);
    wrapper.appendChild(popUp);
}
function checkLoaded() {
    return document.readyState === "complete";
}
function alert(txt, title="Messaggio"){
    var popUp = document.createElement("div");
    var popUpTitle = document.createElement("h1");
    var popUpMessage = document.createElement("h3");
    var submit = document.createElement("input");


    popUp.classList.add("popUp");

    popUpTitle.innerHTML = title;
    popUpMessage.innerHTML = txt;


    submit.type = "button";
    submit.onclick = function(){
        wrapper.removeChild(popUp);
    }
    submit.value = "OK";


    popUp.appendChild(popUpTitle);
    popUp.appendChild(popUpMessage);
    popUp.appendChild(submit);
    if(checkLoaded()){
        wrapper.appendChild(popUp);
    }else{
        window.addEventListener("load",function(){
            wrapper.appendChild(popUp);
        })
    }
}

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}
