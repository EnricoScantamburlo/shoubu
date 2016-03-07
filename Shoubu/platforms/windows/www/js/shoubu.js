var svg = document.getElementById("svg_object");
var svgDoc = svg.contentDocument;
var timerText = svgDoc.getElementById("timerText");

var lastTimeChecked;
var totalTimePassed = 0;

var totalTimeInMillisecons = 90 * 1000;

var timer = null;
var started = false;

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
    } else if (started && timer !== null) { // I pause 
        clearTimeout(timer);
        timer = null;
    } else if (started && timer === null) { // I resume
        var d = new Date();
        lastTimeChecked = d.getTime();
        timer = setInterval(decrementTime, 100);
    }
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


