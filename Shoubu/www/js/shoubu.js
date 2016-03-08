// Variable declaration
var svg = document.getElementById("svg_object");
var svgDoc = svg.contentDocument;
// the text box with the time
var timerText = svgDoc.getElementById("timerText");


// the rect containg hajime
var hajimeButton = svgDoc.getElementById("hajimeButton");
var yameButton = svgDoc.getElementById("yameButton");
var tsuzuketeButton = svgDoc.getElementById("tsuzuketeButton");

var rightPointsText = svgDoc.getElementById("rightPointsText");
var leftPointsText = svgDoc.getElementById("leftPointsText");



// The svg2 root element
var svgRoot = svgDoc.getElementById("svg2");
svgRoot.setAttribute("width", "100%");
svgRoot.setAttribute("height", "100%");

var lastTimeChecked;
var totalTimePassed = 0;

var totalTimeInMillisecons = 90 * 1000;

var timer = null;
var started = false;

// Constants
var SVG_WIDTH = 1920;
var SVG_HEIGHT = 1080;

// to resize the SVG
$(document).ready(function () {   
    var docWidth = $( document ).width() * window.devicePixelRatio;
    var docHeight =  $( document ).height() * window.devicePixelRatio;
    
    var wr = docWidth / SVG_WIDTH;
    var w = SVG_WIDTH/wr;
    
    var hr = docHeight / SVG_HEIGHT;
    var h =  SVG_HEIGHT/hr;
    
    console.info("WR: " + wr);
    console.info("HR: " + hr);
    console.info("New width is: " + w);
    console.info("New height is: " + h);
   
   
    svgRoot.setAttribute("viewBox", "0 0 "+ w + " " + h);
});

// Model

var shoubuModel = {rightPoints : 0, leftPoints : 0, rightPenalties : 0, leftPenalties : 0 };


finishUI();
applyModelUI();


// Functions

/**
 * Startes the timer
 * @returns {undefined}
 */
function startTimer() {
    if (!started) { //It has not started yet
        started = true;
        var time = timerText.innerHTML;
        // String is 00:00 or 00
        var pieces = time.split(":");
        if (pieces.length === 1) {
            totalTimeInMillisecons = 1000 * parseInt(pieces[0]);
        } else if (pieces.length === 2) {
            totalTimeInMillisecons = 1000 * (60 * parseInt(pieces[0]) + parseInt(pieces[1]));
        }

        var d = new Date();
        lastTimeChecked = d.getTime();
        totalTimePassed = 0;

        timer = setInterval(decrementTime, 100);
        startUI();
    } else if (started && timer !== null) { // I pause 
        clearTimeout(timer);
        timer = null;
        pauseUI();
    } else if (started && timer === null) { // I resume
        var d = new Date();
        lastTimeChecked = d.getTime();
        timer = setInterval(decrementTime, 100);
        startUI();
    }
}

function leftIppon(){
    shoubuModel["leftPoints"] += 3;
    applyModelUI();
}

function rightIppon(){
    shoubuModel["rightPoints"] += 3;
    applyModelUI();
}
function leftWazaAri(){
    shoubuModel["leftPoints"] += 2;
    applyModelUI();
}

function rightWazaAri(){
    shoubuModel["rightPoints"] += 2;
    applyModelUI();
}
function leftYuko(){
    shoubuModel["leftPoints"] ++;
    applyModelUI();
}

function rightYuko(){
    shoubuModel["rightPoints"] ++;
    applyModelUI();
}

/**
 * check the remaining timer and decreses the time display
 * @returns {undefined}
 */
function decrementTime() {
    var d = new Date();
    var currentTime = d.getTime();



    var timeSpent = currentTime - lastTimeChecked;
    totalTimePassed += timeSpent;
    lastTimeChecked = currentTime;

    var totalTimeRemaining = totalTimeInMillisecons - totalTimePassed;

    if (totalTimeRemaining <= 0) {
        resetTime();
        finishUI();
    } else {

        var timeString = timeDiffToString(totalTimeRemaining);
        timerText.innerHTML = timeString;
    }
}


/**
 * resets the timer
 * @returns {undefined}
 */
function resetTime() {
    if (timer !== null) {
        clearTimeout(timer);
        timer = null;
    }
    started = false;
    var timeString = timeDiffToString(totalTimeInMillisecons);
    timerText.innerHTML = timeString;
    
}

/**
 * creates a String representation of the 
 * @param {Number} timeDiff time in milliseconds 
 * @returns {String} the string reprsentation of the input
 */
function timeDiffToString(timeDiff) {
    var allSeconds = Math.round(timeDiff / 1000);
    var minutes = Math.floor(allSeconds / 60);
    var seconds = allSeconds - minutes * 60;

    return  (minutes < 10 ? "0" : "") + minutes +
            (seconds < 10 ? ":0" : ":") + seconds;

}

// UI Functions
function startUI(){
    hajimeButton.style.visibility='hidden';
    yameButton.style.visibility='visible';
    tsuzuketeButton.style.visibility='hidden';
}

function pauseUI(){
    hajimeButton.style.visibility='hidden';
    yameButton.style.visibility='hidden';
    tsuzuketeButton.style.visibility='visible';
}

function finishUI(){
    hajimeButton.style.visibility='visible';
    yameButton.style.visibility='hidden';
    tsuzuketeButton.style.visibility='hidden';
}

function applyModelUI(){
    rightPointsText.innerHTML = shoubuModel["rightPoints"];
    leftPointsText.innerHTML = shoubuModel["leftPoints"];
}


