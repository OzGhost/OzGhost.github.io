
window.onload = function(){
    var rw = undefined;
    var rh = undefined;
    (function(){
        var b = window.getComputedStyle(document.body);
        var w = Number.parseInt( b.getPropertyValue("width") );
        var h = Number.parseInt( b.getPropertyValue("height") );
        rw = Math.floor(w / 32) - 1;
        rh = Math.floor(h / 32) - 1;
    })();
    console.log("w: ", rw, " h: ", rh);
    var fr = document.createElement("div");
    fr.style.width = (rw * 32) + "px";
    fr.style.height = (rh * 32) + "px";
    document.body.appendChild(fr);
    var mx = [];
    (function(){
        for (var i = 0; i < rh; i++) {
            var l = [];
            for (var j = 0; j < rw; j++) {
                var t = document.createElement("p");
                l.push(t);
                fr.appendChild(t);
            }
            mx.push(l);
        }
    })();
    var sna = [];
    grow([ Math.floor(rh/2), Math.floor(rw/2) ]);
    function grow(head) {
        mx[head[0]][head[1]].className = "snak3";
        sna.unshift(head);
    }
    var kp = setInterval(tick, 100);
    /**
     *   N
     * W   E
     *   S
     */
    var di = 'E';
    var food = undefined;
    function tick() {
        var next = step();
        function step() {
            var ch = sna[0];
            switch(di) {
                case 'E': return [ch[0], ch[1]+1];
                case 'W': return [ch[0], ch[1]-1];
                case 'N': return [ch[0]-1, ch[1]];
                case 'S': return [ch[0]+1, ch[1]];
            }
        }
        if (next[0] < 0
            || next[0] >= rh
            || next[1] < 0
            || next[1] >= rw
            || mx[next[0]][next[1]].className == 'snak3'
        ) {
            clearInterval(kp);
            console.log("die");
            return;
        }
        grow(next);
        if (next[0] == food[0] && next[1] == food[1]) {
            if (feed()) {
                clearInterval(kp);
                console.log("win");
                return;
            }
        } else {
            trim();
        }
        function trim() {
            var tail = sna.pop();
            mx[tail[0]][tail[1]].className = "";
        }
    }
    document.body.addEventListener('keydown', function(e){
        switch(e.key) {
            case "ArrowRight":
                if (di == 'N' || di == 'S') di = 'E';
                break;
            case "ArrowLeft":
                if (di == 'N' || di == 'S') di = 'W';
                break;
            case "ArrowUp":
                if (di == 'E' || di == 'W') di = 'N';
                break;
            case "ArrowDown":
                if (di == 'E' || di == 'W') di = 'S';
                break;
        }
    });
    feed();
    function feed() {
        var col = [];
        for (var i = 0; i < rh; i++) {
            for (var j = 0; j < rw; j++) {
                var x = mx[i][j];
                if ( ! x.className) {
                    col.push([x, i, j]);
                }
            }
        }
        if ( ! col.length) {
            return true;
        }
        var x = col[Math.floor(col.length * Math.random())];
        x[0].className = 'food';
        food = [x[1], x[2]];
        return false;
    }
};

