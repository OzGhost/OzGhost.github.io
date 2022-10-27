window.onload = (function(){
    var links = [
        [],
        [4, 11], //1
        [5, 9],
        [11, 14], //3
        [3],
        [1, 6], //5
        [7, 16],
        [15, 17], // 7
        [3, 6],
        [15], // 9
        [12, 16],
        [10, 19, 20, 23], // 11
        [2, 22],
        [1, 26], // 13
        [5, 18, 20, 30],
        [17, 25], // 15
        [7, 29],
        [8, 27, 28], // 17
        [19, 27],
        [8, 21], // 19
        [2],
        [12, 31], // 21
        [10, 24],
        [9, 21], // 23
        [4, 13],
        [13], // 25
        [14],
        [26, 28], // 27
        [22, 29],
        [25, 30], // 29
        [31],
        [23, 24]  // 31
    ];

    var rli = [ [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [] ];
    var i = 0;
    var j = 0;
    var t = null;
    for (i = 1; i < links.length; i++) {
        t = links[i];
        for (j = 0; j < t.length; j++)
            rli[t[j]].push(i);
    }

    function grow(from, to, fp, d) {
        var si = 0;
        if (to == from)
            return { fp: fp, d: d};
        var nexts = rli[from];
        var candis = [];
        var c = undefined;
        for (si = 0; si < nexts.length; si++) {
            var next = nexts[si];
            if (fp.includes(">" + next + ">"))
                continue;
            var newfp = fp + next + ">";
            c = grow(next, to, newfp, d+1);
            candis.push(c);
        }
        if ( ! candis.length)
            return {};
        var min = undefined;
        for (si = 0; si < candis.length; si++) {
            c = candis[si];
            if (c.d) {
                if (min) {
                    if (c.d < min.d) {
                        min = c;
                    }
                } else {
                    min = c;
                }
            }
        }
        return min || {};
    }

    (function(){
        var pre = document.getElementById("screen");
        /*
        var frome = document.getElementById("frome");
        var toe = document.getElementById("toe");
        var box = document.getElementById("box");
        box.addEventListener("submit", function(e){
            e.preventDefault();
            var from = frome.value;
            var to = toe.value;
            if (from < 1 || from > 31 || to < 1 || to > 31) {
                pre.innerText = "noYou";
                return;
            }
            var o = grow(from, to, ">" + from + ">", 0);
            pre.innerText = o.fp.replace(/>/g, " > ");
        });
        */
        var iw = document.getElementById("iwindow");
        var nextbtn = document.getElementById("addHollow");
        var idx = 1;
        nextbtn.addEventListener("click", function() {
            var ho = document.createElement("span");
            ho.innerHTML = "<i>"+idx+"</i>";
            ho.className = "hollow";
            ho.style.top = "0px";
            ho.style.left = "0px";
            ho.title = ""+idx;
            ho.addEventListener("mousedown", trap);
            iw.appendChild(ho);
            idx++;
        });
        var eue = null;
        var px = 0;
        var py = 0;
        var ex = 0;
        var ey = 0;
        var engaged = false
        function trap(e) {
            console.log("trap");
            if (engaged) {
                console.log("release");
                engaged = false;
                document.body.removeEventListener("mousemove", relocate);
            } else {
                eue = e.target;
                px = e.x;
                py = e.y;
                ey = parseInt(e.target.style.top);
                ex = parseInt(e.target.style.left);
                document.body.addEventListener("mousemove", relocate);
                engaged = true;
                console.log("hold", ex, ey);
            }
            e.stopPropagation();
        }
        function relocate(e) {
            var dx = e.x - px;
            var dy = e.y - py;
            ex += dx;
            ey += dy;
            eue.style.top = ey+"px";
            eue.style.left = ex+"px";
            px = e.x;
            py = e.y;
        }
        var nodes = document.getElementsByClassName("hollow");
        for (i = 0; i < nodes.length; i++)
            nodes[i].addEventListener("click", togglePick);
        var frome = null;
        var toe = null;
        var gin = document.getElementById("gin");
        function togglePick(e) {
            if (e.target == frome) {
                frome.className = "hollow";
                frome = null;
                gin.innerHTML = "";
                return;
            }
            if (e.target == toe) {
                toe.className = "hollow";
                toe = null;
                gin.innerHTML = "";
                return;
            }
            if (!frome) {
                frome = e.target;
                frome.className = "hollow picked"
                if (toe) roam();
                return;
            }
            if (!toe) {
                toe = e.target;
                toe.className = "hollow picked"
                if (frome) roam();
                return;
            }
            if (frome && toe) {
                frome.className = "hollow"
                frome = e.target;
                frome.className = "hollow picked"
                toe.className = "hollow"
                toe = null;
                gin.innerHTML = "";
            }
        }
        function roam() {
            var from = +frome.title;
            var to = +toe.title;
            var o = grow(from, to, ">" + from + ">", 0);
            pre.innerText = o.fp.replace(/>/g, " > ");
            var ils = o.fp.split(">");
            gin.innerHTML = "";
            for (var i = 1; i < ils.length - 2; i++) {
                var t = document.createElement("img");
                t.className = "arrow";
                t.src = "d/" + ils[i] + "t"+ ils[i+1] +".png";
                gin.appendChild(t);
            }
        }
        var iic = 1;
        function expand(idx) {
            gin.innerHTML = "";
            var ds = rli[idx];
            for (j = 0; j < ds.length; j++) {
                var t = document.createElement("img");
                t.className = "arrow";
                t.src = "d/" + idx + "t"+ ds[j] +".png";
                gin.appendChild(t);
            }
        }
        document.getElementById("ntube").addEventListener("click", function(){ expand(iic++) });
    })();
})();
