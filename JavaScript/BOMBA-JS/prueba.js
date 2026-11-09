var theCount;
var alarm = document.getElementById("alarm");
var alarm2 = document.getElementById("alarm2");
var panel = document.getElementById("panel");
var turnOff = document.getElementById("turn-off");
var turnOffHor = document.getElementById("closing");
var detonate = document.getElementById("detonate");
alarm.volume = 0.50; //volume level

var time = document.getElementById("time");
function showCountDown() {
    time.innerText = time.innerText - 1;
    if (time.innerText == 0) {
        clearInterval(theCount);
        time.classList.add("crono");
        abort.classList.add("hide");
        detonate.classList.add("show");
        setTimeout(function () {
            turnOff.classList.add("close");
            turnOffHor.classList.add("close");
            reload.classList.add("show");
            alarm.pause();
            alarm2.play();
        }, 1500);
    }
}

var cover = document.getElementById("activate");
activate.addEventListener("click", function (){
    this.classList.add("pushed");
    alarm.load();
    alarm.currentTime = 10.1;
    alarm.play();
    setTimeout(function () {
        panel.classList.add("show");
        theCount = setInterval(showCountDown, 1000);
        alarm.load();
        alarm.play();
    }, 500)
});