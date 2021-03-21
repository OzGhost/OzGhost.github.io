
var kickin = function() {
    var time = 550;
    var screen = document.getElementById("screen");
    screen.prepend(screen.lastElementChild);
    document.body.addEventListener("keydown", function(e) {
        if ("ArrowRight" == e.key) {
            screen.className = "go";
            setTimeout(function(){
                screen.append(screen.firstElementChild);
                screen.className = "";
            }, time);
        }
        if ("ArrowLeft" == e.key) {
            screen.className = "back";
            setTimeout(function(){
                screen.prepend(screen.lastElementChild);
                screen.className = "";
            }, time);
        }
    });
};

window.onload = kickin;

