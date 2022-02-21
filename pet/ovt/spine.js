function ready(){
    var store = window._formula; // see formula.js
    function reload(ev) {
        var val = ev.target.value;
        if ( ! val) return;
        var len = val.length;
        if (len < 2) return;
        var cs = val.charAt(len-1).toLowerCase();
        var c = val.charAt(len-2);
        var next = nextOf(c, cs);
        if ( ! next) return;
        ev.target.value = val.substring(0, len-2) + next;
    }
    function nextOf(c, cs) {
        var idx = -1;
        switch(cs) {
            case "w": idx=0; break;
            case "a": idx=1; break;
            case "d": idx=2; break;
            case "e": idx=3; break;
            case "o": idx=4; break;

            case "s": idx=5; break;
            case "f": idx=6; break;
            case "r": idx=7; break;
            case "x": idx=8; break;
            case "j": idx=9; break;

            default: idx=-1; break;
        }
        if (idx < 0) return null;
        var ccase = store[c];
        if ( ! ccase) return null;
        return ccase[idx];
    }
    var tag = document.getElementById("typearea");
    tag.focus();
    tag.addEventListener("input", reload);
};
window.onload = ready;

