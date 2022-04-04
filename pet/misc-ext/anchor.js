
(function(){
    var hooks = [];
    window.addHook = function(h) {
        if (typeof h == 'function') {
            hooks.push(h);
        }
    };
    console.log("__[o0] Anchor landed ...");
    var tag = document.createElement("a");
    tag.className = "mx-anchor";
    tag.href = "/misc-ext";
    tag.addEventListener("click", function(e) {
        e.preventDefault();
        for (var i = 0; i < hooks.length; i++) {
            hooks[i]();
        }
    });
    document.body.appendChild(tag);
})();

