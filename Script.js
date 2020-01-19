// var video = document.getElementById('video');

// if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//         video.srcObject = stream;
//         video.play();
//     });
// }

var capture;
var tracker;
var slouchHeight;
var uprightHeight;
var time;
var timers = [];

var w = 640,
    h = 480;

function setup() {
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function () {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();

    colorMode(HSB);

    tracker = new clm.tracker();
    tracker.init();
    tracker.start(capture.elt);
}

function draw() {
    image(capture, 0, 0, w, h);
    var positions = tracker.getCurrentPosition();

    noFill();
    stroke(255);
    beginShape();
    for (var i = 0; i < positions.length; i++) {
        vertex(positions[i][0], positions[i][1]);
    }
    endShape();

    noStroke();
    for (var i = 0; i < positions.length; i++) {
        fill(map(i, 0, positions.length, 0, 360), 50, 100);
        ellipse(positions[i][0], positions[i][1], 4, 4);
        text(i, positions[i][0], positions[i][1]);
        // console.log(positions[33][1]);
    }

    if (positions.length > 0) {
        var mouthLeft = createVector(positions[44][0], positions[44][1]);
        var mouthRight = createVector(positions[50][0], positions[50][1]);
        var smile = mouthLeft.dist(mouthRight);
    }
    check();
}

function calibrateSlouch() {
    var positions = tracker.getCurrentPosition();
    if (positions.length > 0) {
        slouchHeight = positions[33][1];
        console.log('slouch calibrated');
    }
}

function calibrateUpright() {
    var positions = tracker.getCurrentPosition();
    if (positions.length > 0) {
        uprightHeight = positions[33][1];
        console.log('up right calibrated');
    }
}

function check() {
    var positions = tracker.getCurrentPosition();
    if (positions.length > 0) {
        if (((slouchHeight - uprightHeight) / 2) + uprightHeight < positions[33][1]) {
            timers.push(setTimeout(function() {
                if (((slouchHeight - uprightHeight) / 2) + uprightHeight < positions[33][1]) {
                    playSound();
                    for (var i = 0; i < timers.length; i++)
                    {
                        clearTimeout(timers[i]);
                    }
                }
            }, 5000));
        }
    }
}

function playSound() {
    document.getElementById("text").innerHTML = "you have slouched";
}

function slouched() {
    document.getElementById("text").innerHTML = "";
}