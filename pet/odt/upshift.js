function init(){
    var wb = document.getElementById('board');
    var lock = 0;
    var onFusion = function(ev) {
        if (ev.key != 'Control')
            return;
        if (!lock) {
            lock = 1;
            setTimeout(function(){ lock = 0; }, 200);
            return;
        }
        lock = 0;
        var txt = wb.value;
        var len = txt.length;
        if (!len)
            return;
        var idx = len-1;
        var c = txt.charAt(idx);
        while (c == ' ' || c == '\t' || c == '\n') {
            idx--;
            if (idx < 0)
                return;
            c = txt.charAt(idx);
        }
        var nc = '';
        switch (c) {
            case 'a': nc = '\u{00E4}'; break;
            case 'A': nc = '\u{00C4}'; break;
            case 'o': nc = '\u{00F6}'; break;
            case 'O': nc = '\u{00D6}'; break;
            case 'u': nc = '\u{00FC}'; break;
            case 'U': nc = '\u{00DC}'; break;
            case 's': nc = '\u{00DF}'; break;
            case 'S': nc = '\u{1E9E}'; break;
        }
        if (nc)
            wb.value = txt.substring(0, idx) + nc;
    }
    window.addEventListener('keydown', onFusion);
}
init();
