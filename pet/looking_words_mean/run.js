
var handleResult = function() {
    console.log(this);
    document.getElementById("rs").appendChild(
        document.createTextNode(this.response)
    );
};


var kickAss = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://vdict.com/ass,1,0,0.html", true);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log(this);
            document.getElementById("rs").innerHTML = this.responseText
        }
    };
    xhr.send();
};

window.onload = kickAss;
