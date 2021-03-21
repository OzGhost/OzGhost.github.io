var prevQs = [];
var q = "";

function randInRange (a, b) {
    return Math.round((Math.random() * 1000 )) % (1 + b - a) + a;
}

function randInRangeNotIn (a, b, c) {
    var x = 0;
    var flag = true;
    while (flag) {
        x = randInRange(a, b);
        if (c.indexOf(x) < 0) {
            flag = false;
        }
    }
    return x;
}

function checkingData () {
    if (!data === undefined) {
        window.alert("Data not found!");
    }
    if (data.length < 1) {
        window.alert("Data is empty!");
    }
}

function post (e) {
    e.preventDefault();
    var ain = document.getElementById("a");
    var a = ain.value;
    if (a !== q) {
        wrongNotice();
    } else {
        ain.value = "";
        ain.focus();
        nextQuestion();
    }
}

function nextQuestion () {
    document.getElementById("remain").innerHTML = data.length;
    if (data.length < 1) {
        document.getElementById("q").innerHTML = "...";
        return;
    }
    var i = randInRange(0, data.length - 1);
    q = data[i];
    data.splice(i, 1);
    document.getElementById("q").innerHTML = q;
}

function wrongNotice () {
    document.getElementById("a").className = "wrong";
    setTimeout(function(){
        document.getElementById("a").className = "";
    }, 100);
}

function kickAss () {
    document.getElementById("answer").onsubmit = post;
    checkingData();
    nextQuestion();
}

window.onload = kickAss;
