var colors = [
    "222831", //ground
    "76abae",
    "eabe6c",
    "ff204e"
];

var countRack = [];
var t1 = document.createElement("tr");
var t2 = document.createElement("tr");
var cs = "";
var cur = document.getElementById("cur");
cur.className = "c-"+colors[0];
for (var i = 0; i < colors.length; i++) {
    var d1 = document.createElement("td");
    var d2 = document.createElement("td");
    t1.appendChild(d1);
    t2.appendChild(d2);
    var c = colors[i];
    d1.className = "c-"+c;
    countRack.push(d2);
    cs += ".c-"+c+" { background: #"+c+"; }"
    d1.addEventListener("click", function(e){
        cur.className = e.target.className;
    });
}
var cpicker = document.getElementById("cpicker");
cpicker.appendChild(t1);
cpicker.appendChild(t2);

var grid = [];
var w = 25;
var tb = document.getElementById("grid");
for (var i = 0; i < w; i++) {
    var l = [];
    var tr = document.createElement("tr");
    for (var j = 0; j < w; j++) {
        var c = document.createElement("td");
        c.className = cur.className;
        tr.appendChild(c);
        l.push(c);
        (function(){
            var ii = i;
            var ij = j;
            c.addEventListener("click", function(e){
                e.target.className = cur.className;
                expand(e, ii, ij);
            });
        })();
    }
    grid.push(l);
    tb.appendChild(tr);
}

var prev = 0;
function expand(e, i, j) {
    var pa = prev;
    var pb = ( prev = [i, j] );
    //console.log("ver: ", e.shiftKey, pa, pb);
    if (!e.shiftKey || !pa) return;
    if (pa[0] != pb[0] && pa[1] != pb[1]) return;
    if (pa[0] == pb[0]) {
        var m = Math.min(pa[1], pb[1]) +1;
        var n = Math.max(pa[1], pb[1]);
        while (m < n)
            grid[pa[0]][m++].className = cur.className;
    } else {
        var m = Math.min(pa[0], pb[0]) +1;
        var n = Math.max(pa[0], pb[0]);
        while (m < n)
            grid[m++][pa[1]].className = cur.className;
    }
}

document.getElementById("counter").addEventListener("click", function(){
    var m = {};
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < w; j++) {
            var ov = m[ grid[i][j].className ] || 0;
            m[ grid[i][j].className ] = 1 + ov;
        }
    }
    for (var i = 0; i < colors.length; i++)
        countRack[i].innerText = m[ "c-"+colors[i] ];
});

var skin = document.createElement("style");
document.head.appendChild(skin);
skin.innerText = cs
    + "body { background: #222831; }"
    + "td { padding: 6px; border: 1px solid darkgrey; border-radius: 3px; color: white; }"
    + "#cur { border: 1px solid darkgrey; display: inline-block; padding: 6px }"
    + "i { color: white; }"
;
// init
cur.className = "c-"+colors[1];
