
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

function isValidStroke(e) {
    if (e.ctrlKey && /[vcxr]/i.test(e.key)) {
        return true;
    }
    if (/([0-9]|Backspace|Arrow\w+|Delete|End|Home|Tab|Enter|Shift)/.test(e.key)) {
        return true;
    }
    return false;
}

function log(msg) {
    var el = document.getElementById("console");
    el.innerHTML = msg + "\n" + el.innerHTML;
}

function mountOn(el, options) {
    var delemiter = options.delemiter || "";
    var suffix = options.suffix || "";
    var prefix = options.prefix || "";
    var pastValue = currencyFormat(options.initialValue, delemiter);
    var reverseErase = false;

    el.type = "text";
    el.value = prefix + pastValue + suffix;

    function hijack() {
        log(": hijack start :");
        log("past value: " + pastValue);
        var caretPos = el.selectionStart;
        log("current caretPos: " + caretPos);
        var currentValue = el.value;
        log("current value: " + currentValue);
        function delegateErasing() {
            if (currentValue.length == pastValue.length - 1 && pastValue[caretPos] == delemiter) {
                log("delegate erase: " + (reverseErase ? -1 : 1));
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
        log("new value: " + hijackValue);
        function resetCaretPosition() {
            var i, preCaretCount = 0;
            if (caretPos == currentValue.length) {
                log("skip reset caret");
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
            if (hijackValue[i] == delemiter) i++;
            log("reset caret to " + i);
            el.selectionStart = i;
            el.selectionEnd = i;
        }
        resetCaretPosition();
        pastValue = hijackValue;
        log(": hijack end :");
    }

    el.addEventListener("input", function(e){
        hijack();
    });
    el.addEventListener("keydown", function(e){
        reverseErase = e.key == "Delete";
        if ( ! isValidStroke(e)) {
            log("prevent keydown: " + e.key);
            e.preventDefault();
        }
    });
    el.addEventListener("focus", function(){
        var val = el.value;
        if (val) {
            log("detach suffix");
            el.value = val.substring(prefix.length, val.length - suffix.length);
        }
    });
    el.addEventListener("blur", function(){
        if (el.value) {
            log("attach suffix");
            el.value = prefix + el.value + suffix;
        }
    });
}

window.onload = function() {
    var el = document.getElementById("currency-input");
    var options = {
        delemiter: "'",
        suffix: " CHF",
        initialValue: 1234567
    };
    mountOn(el, options);
    el.focus(); // FIXME development convenience
};

