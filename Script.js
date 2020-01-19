var capture;
var tracker;
var slouchHeight;
var uprightHeight;
var time;
var timers = [];
var audio = document.getElementById("myAudio");
var w = 640,
    h = 480;
var cnv;
var x, y;

function setup() {
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    },
    function () {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    capture.size(w, h);
    cnv = createCanvas(w, h);
    cnv.position(x, y);
    x = (window.innerWidth - width) / 2;
    y = (window.innerHeight - height) / 2 + 40;
    capture.hide();


    colorMode(HSB);

    tracker = new clm.tracker();
    tracker.init();
    tracker.start(capture.elt);
    hideButton();
    hideSuccess();
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
        // text(i, positions[i][0], positions[i][1]);
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
        showSuccess();
    }
}

function calibrateUpright() {
    var positions = tracker.getCurrentPosition();
    if (positions.length > 0) {
        uprightHeight = positions[33][1];
        console.log('up right calibrated');
        showSuccess2();
    }
}

function check() {
    var positions = tracker.getCurrentPosition();
    if (positions.length > 0) {
        if (((slouchHeight - uprightHeight) / 2) + uprightHeight < positions[33][1]) {
            timers.push(setTimeout(function() {
                if (((slouchHeight - uprightHeight) / 2) + uprightHeight < positions[33][1]) {
                    window.scrollTo(0,document.body.scrollHeight);
                    playSound();
                    for (var i = 0; i < timers.length; i++)
                    {
                        clearTimeout(timers[i]);
                    }
                }
            }, 3000));
        }
    }
}

function playSound() {
    showButton();
    playAudio();
}

function slouched() {
    document.getElementById("text").innerHTML = "";
    audio.pause();
    hideButton();
}

function playAudio(){
    audio.play();
}

function hideButton() {
    y = (window.innerHeight - height) / 2 + 90;
    cnv.position(x, y);
    var hiddenButton = document.getElementById("reset-button");
    hiddenButton.style.display = "none";
}

function showButton(){
    y = (window.innerHeight - height) / 2 + 40;
    cnv.position(x, y);
    var hiddenButton = document.getElementById("reset-button");
    hiddenButton.style.display = "block";
}

function showSuccess(){
    var success = document.getElementById("success-text");
    success.style.display = "block";
    $("#success-text").fadeOut(3000);
}

function showSuccess2(){
    var success = document.getElementById("other-success-text");
    success.style.display = "block";
    $("#other-success-text").fadeOut(3000);
}

function hideSuccess(){
    var success = document.getElementById("success-text");
    success.style.display = "none";
    var success2 = document.getElementById("other-success-text");
    success2.style.display = "none";  
}