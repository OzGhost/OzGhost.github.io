
function eraseAt(s, i) {
    if (i < 0 || i >= s.length) return s;
    if (i == 0) {
        return s.substring(1);
    }
    if (i == s.length - 1) {
        return s.substring(0, s.length - 1);
    }
    return s.substring(0, i) + s.substring(i+1);
}

function currencyFormat(s, delemiter) {
    var hijackValue = (""+s).replace(/[^0-9]/g, "");
    hijackValue = hijackValue.replace(/\B(?=(?:\d{3})+(?!\d))/g, delemiter);
    return hijackValue;
}

function mountOn(el, options) {
    var delemiter = options.delemiter || "";
    var suffix = options.suffix || "";
    var prefix = options.prefix || "";
    var pastValue = currencyFormat(options.initialValue, delemiter);
    var reverseErase = false;

    el.type = "text";
    el.value = prefix + pastValue + suffix;

    el.addEventListener("input", function(){
        var caretPos = this.selectionStart;
        var currentValue = el.value;
        function delegateErasing() {
            if (currentValue.length == pastValue.length - 1 && pastValue[caretPos] == delemiter) {
                if (reverseErase) {
                    return eraseAt(currentValue, caretPos);
                } else {
                    caretPos--;
                    return eraseAt(currentValue, caretPos);
                }
            }
            return currentValue;
        }
        var hijackValue = delegateErasing();
        hijackValue = hijackValue.replace(/[^0-9]/g, "");
        hijackValue = hijackValue.replace(/\B(?=(?:\d{3})+(?!\d))/g, delemiter);
        el.value = hijackValue;
        function resetCaretPosition() {
            var i, preCaretCount = 0;
            if (caretPos == currentValue.length) {
                return;
            }
            for (i = 0; i < caretPos; i++) {
                if (currentValue[i] != delemiter) {
                    preCaretCount++;
                }
            }
            for (i = 0; i < hijackValue.length && preCaretCount > 0; i++) {
                if (hijackValue[i] != delemiter) {
                    preCaretCount--;
                }
            }
            el.selectionStart = i;
            el.selectionEnd = i;
        }
        resetCaretPosition();
        pastValue = hijackValue;
    });
    el.addEventListener("keydown", function(e){
        reverseErase = e.key == "Delete";
        if (e.ctrlKey && /[vcxr]/i.test(e.key)) {
            return;
        }
        if (/([0-9]|Backspace|Arrow\w+|Delete|End|Home|Tab|Enter)/.test(e.key)) {
            return;
        }
        e.preventDefault();
    });
    el.addEventListener("focus", function(){
        var val = el.value;
        if (val) {
            el.value = val.substring(prefix.length, val.length - suffix.length);
        }
    });
    el.addEventListener("blur", function(){
        if (el.value) {
            el.value = prefix + el.value + suffix;
        }
    });
}

window.onload = function() {
    var el = document.getElementById("currency-input");
    var options = {
        delemiter: "'",
        suffix: " CHF",
        initialValue: 1000000
    };
    mountOn(el, options);
    el.focus(); // FIXME development convenience
};

