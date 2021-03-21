var pull = function() {
    document.getElementById("tray").className = "";
    setTimeout(function(){
        var holder = document.getElementById("tray");
        var first = document.querySelectorAll("#tray .item")[0];
        holder.removeChild(first);
        holder.appendChild(first);
        holder.className = "ready";
        setTimeout(pull, 200)
    }, 500);
};

var toggleCheck = function () {
    var curr = document.querySelector("#show:checked");
    if (curr === null) {
        document.getElementById("holder").style.overflow = "hidden";
    } else {
        document.getElementById("holder").style.overflow = "visible";
    }
};

var kickass = function() {
    setTimeout(pull, 500);
    document.getElementById("show").onchange = toggleCheck;
};

window.onload = kickass;
