
function Fug() {
    var cs = ['a', 'b', 'c', 'd', 'e', 'f'];
    function getNext() {
        var id = '';
        for (var i = 0; i < 36; i++) {
            id += getCharAt(i);
        }
        return id;
    }
    function getCharAt(index) {
        switch(index) {
            case 8:
            case 13:
            case 18:
            case 23:
                return '-';
        }
        if (nextNumber(2) == 0) {
            return cs[nextNumber(6)];
        } else {
            return nextNumber(10);
        }
    }
    function nextNumber(ub) {
        return Math.floor(Math.random()*ub);
    }
    return {
        next: getNext
    };
};

document.getElementById('bag').innerHTML = new Fug().next();

