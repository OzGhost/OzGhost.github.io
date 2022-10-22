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
        var frome = document.getElementById("frome");
        var toe = document.getElementById("toe");
        var box = document.getElementById("box");
        var pre = document.getElementById("screen");
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
    })();
})();
