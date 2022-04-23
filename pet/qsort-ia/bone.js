
(function(){
    var next = [];
    for (var k = 0; k < 99; k++) {
        next[k] = Math.round(Math.random() * 200);
    }
    var inp = next;
    var roof = findRoof(inp);
    var screen = document.getElementById("screen");
    var rest = 50;
    function findRoof(inp) {
        var max = inp[0];
        for (var i = 1; i < inp.length; i++) {
            if (inp[i] > max) max = inp[i];
        }
        return max;
    }
    var arr = init(inp);
    function init(inp) {
        var out = [];
        for (var i = 0; i < inp.length; i++) {
            out.push({val: inp[i], el: addPilar(inp[i])});
        }
        return out;
    }
    function addPilar(val) {
        var h = val/roof * 100;
        h += "%";
        var el = document.createElement("span");
        el.style.height = h;
        var pilar = document.createElement("p");
        pilar.appendChild(el);
        screen.appendChild(pilar);
        return pilar;
    }
    qSort(arr, 0, arr.length - 1).then(function(){ window.alert("All done!"); });
    function qSort(arr, l, h) {
        if (l >= h) return Promise.resolve();
        return part(arr, l, h)
            .then(function(pi) {
                return qSort(arr, l, pi - 1).then(function(){ return pi; });
            })
            .then(function(pi) { return qSort(arr, pi + 1, h); });
    }
    function part(arr, l, h) {
        return paint(arr[h].el)
            .then(function(){
                var p = arr[h].val;
                var i = l - 1;
                var q = Promise.resolve();
                for (var j = l; j < h; j++) {
                    if (arr[j].val < p) {
                        i++;
                        (function(){
                            var x = i;
                            var y = j;
                            q = q.then(function(){ return swap(arr[x], arr[y]); });
                        })();
                    }
                }
                i++;
                return q.then(function() { return swap(arr[i], arr[h]); })
                    .then(function() { return i; });
            });
    }
    function paint(el, ex) {
        return new Promise(function(resolve, reject){
            el.className = "up";
            if (ex) ex.className = "up";
            setTimeout(resolve, rest);
        });
    }
    function swap(a, b) {
        return paint(a.el, b.el)
            .then(function(){
                var tmp = a.val;
                a.val = b.val;
                b.val = tmp;
                tmp = a.el.innerHTML;
                a.el.innerHTML = b.el.innerHTML;
                b.el.innerHTML = tmp;
                return new Promise(function(resolve, reject){
                    setTimeout(resolve, rest);
                });
            })
            .then(function(){ return peel(a.el, b.el) });
    }
    function peel(x, y) {
        x.className = "";
        y.className = "";
        return new Promise(function(resolve, reject){
            setTimeout(resolve, rest);
        });
    }
})();

