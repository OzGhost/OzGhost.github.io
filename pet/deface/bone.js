
function kickAss() {
    var trigger = document.getElementById("trigger");
    var val = document.getElementById("val");
    var dp = document.getElementById("dp");
    var texts = [
        "Hello",
        "There"
    ];

    var reload = function() {
        var ctn = "";
        for (var i = 0; i < texts.length; ++i) {
            ctn += "<li>"+texts[i]+"</li>";
        }
        dp.innerHTML = ctn;
    }
    
    trigger.addEventListener("click", function(){
        texts.push(val.value);
        reload();
    });

    reload();
}

window.onload = kickAss;

