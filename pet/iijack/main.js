
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
    var reverseErasing = false;
    var rawValue = 0;

    function currencyFormat(s, delemiter) {
        var rawValue = (""+s).replace(/[^0-9]/g, "");
        hijackValue = rawValue.replace(/\B(?=(?:\d{3})+(?!\d))/g, delemiter);
        return hijackValue;
    }

    el.type = "text";
    el.value = currencyFormat(options.initialValue, delemiter) + suffix;

    function hijack() {
        log(": hijack start :");
        var caretPos = el.selectionStart;
        log("current caretPos: " + caretPos);
        var currentValue = el.value;
        log("current value: " + currentValue);
        var hijackValue = currentValue.replace(/[^0-9]/g, "");
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
            if (reverseErasing && hijackValue[i] == delemiter) i++;
            log("reset caret to " + i);
            el.selectionStart = i;
            el.selectionEnd = i;
        }
        resetCaretPosition();
        log(": hijack end :");
    }

    el.addEventListener("input", function(e){
        hijack();
    });
    el.addEventListener("keydown", function(e){
        reverseErasing = e.key == "Delete";
    });
    el.addEventListener("focus", function(){
        var val = el.value;
        if (val) {
            log("detach suffix");
            el.value = val.substring(0, val.length - suffix.length);
        }
    });
    el.addEventListener("blur", function(){
        if (el.value) {
            log("attach suffix");
            el.value = el.value + suffix;
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

