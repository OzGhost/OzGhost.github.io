
for (var i = 0; i < 4; i++) {
    //console.log(Math.random() * 10);
}

window.onload = function(){
    var arr = ['a','x','c','i','k'];
    var rig = rigIt(arr);
    console.log(rig);
    function rigIt(arr) {
        var out = [];
        for (var i = 0; i < arr.length - 1; i++) {
            for (var k = 0; k < arr.length; k++) {
                var r = rign(arr, i+1, k);
                for (var j = 0; j < r.length; j++) {
                    out.push(r[j]);
                }
            }
        }
        out.push(arr);
        return out;
    }
    function rign(arr, n, idx) {
        if (n <= 0 || idx >= arr.length) return [];
        if (n == 1) return [[arr[idx]]];
        var out = [];
        for (var i = idx; i < arr.length; i++) {
            var r = rign(arr, n-1, i+1);
            for (var j = 0; j < r.length; j++) {
                r[j].push(arr[idx]);
                out.push(r[j]);
            }
        }
        return out;
    }
}

