
window.onload = function(){
    var arr = gen(5);
    var rig = rigIt(arr);
    console.log(rig);
    var ana = analize(rig);
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
    function gen(size) {
        var out = [];
        for (var i = 0; i < size; i++) {
            var p = {
                name: "p" + i,
                price: Math.floor(Math.random() * 1000),
                amount: Math.floor(Math.random() * 99) + 1
            };
            out.push(p);
        }
        return out;
    }
    function analize(rig) {
        for (var i = 0; i < rig.length; i++) {
            var arr = rig[i];
            var size = 0;
            var price = 0;
            for (var j = 0; j < arr.length; j++) {
                size += arr[j].amount;
                price += arr[j].price;
            }
            console.log(size, price);
        }
    }
};

