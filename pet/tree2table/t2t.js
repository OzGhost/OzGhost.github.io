var OW_TEXT = "-=>";

var wcell = function(val, d, h, w) {
    return {
        val: val,
        w: w ? w : 1,
        h: h ? h : 1,
        d: d ? d : 1
    };
}

var t2t = function(tree, d) {
    if ( ! tree) {
        return [];
    }

    var drill = function(tree, hnode, cdeep) {
        var iblock = t2t(tree, cdeep+1);
        var h = 0;
        for (var line of iblock) {
            if (line[0].d == cdeep+1) {
                h += line[0].h;
            }
        }
        var icell = wcell(hnode, cdeep, h);
        var flien = [icell];
        for (var c of iblock[0]) {
            flien.push(c);
        }
        var output = [flien];
        for (var i = 1; i < iblock.length; ++i) {
            output.push(iblock[i]);
        }
        return output;
    };

    var cdeep = d ? d : 0;
    var iline = [];
    if ( ! tree.fit.test) {
        iline = [[wcell(tree.test, cdeep), wcell(tree.fit, cdeep)]];
    } else {
        iline = drill(tree.fit, tree.test, cdeep);
    }
    var eline = [];
    if (tree.ow) {
        if ( ! tree.ow.test ) {
            eline = [[wcell(OW_TEXT, cdeep), wcell(tree.ow, cdeep)]];
        } else {
            eline = drill(tree.ow, OW_TEXT, cdeep);
        }
    }
    var mtrix = [];
    for (var i of iline) {
        mtrix.push(i);
    }
    for (var i of eline) {
        mtrix.push(i);
    }
    return mtrix;
};

var prune = function(d2) {
    for (var i = 1; i < d2.length; ++i) {
        var len = d2[i].length;
        if (len > longest) {
            longest = len;
        }
    }
    var pi = [d2[0].length];
    var lenOf = function(clen, i, d2) {
        var len = clen;
        for (var j = 0; j < i; ++j) {
            for (var c of d2[j]) {
                if (c.h > i-j) {
                    ++len;
                }
            }
        }
        return len;
    };

    var longest = d2[0].length;
    for (var i = 1; i < d2.length; ++i) {
        var l = lenOf(d2[i].length, i, d2);
        pi.push(l);
        if (l > longest) {
            longest = l;
        }
    }
    for (var i = 0; i < pi.length; ++i) {
        pi[i] = longest - pi[i];
    }
    var pilu = function(a, l) {
        var o = [];
        for (var i = 0; i < a.length - 1; ++i) {
            o.push(a[i]);
        }
        for (var i = 0; i < l; ++i) {
            o.push(wcell(""));
        }
        o.push(a[a.length-1]);
        return o;
    };
    var pika = function(a, l) {
        a[a.length-2].w = l+1;
        return a;
    }
    for (var i = 0; i < d2.length; ++i) {
        //d2[i] = pilu(d2[i], pi[i]);
        d2[i] = pika(d2[i], pi[i]);
    }
    var header = [wcell("<b>Conditions</b>", 1, 1, longest-1), wcell("<b>Outcome</b>")];
    var mtrix = [header];
    for (var i of d2) {
        mtrix.push(i);
    }
    return mtrix;
};

var print = function(d2) {
    var mtrix = prune(d2);
    var o = "<table>";
    for (var l of mtrix) {
        o += "<tr>";
        for (var r of l) {
            o += "<td"
            if (r.h > 1) {
                o += " rowspan=\""+r.h+"\""
            }
            if (r.w > 1) {
                o += " colspan=\""+r.w+"\""
            }
            o += ">"+r.val.replace(/\n/g, "<br/>")+"</td>"
        }
        o += "</tr>";
    }
    o += "</table>";
    return o;
};

var combi = function() {
    var candi = document.querySelectorAll("code > pre");
    var len = candi.length;
    for (var i = 0; i < len; ++i) {
        var c = candi[i];
        var code = c.innerHTML;
        try {
            var tree = new Parser(code).parse();
            var htmlTree = print(t2t(tree));
            c.parentNode.innerHTML = htmlTree;
        } catch(err) {
            console.warn(err);
            console.warn("Ignore re-display for node: ", c);
        }
    }
};

window.onload = function(){
    var iput = document.getElementById("iput");
    var btn = document.getElementById("tger");
    var oput = document.getElementById("rstab");
    btn.addEventListener("click", function(){
        var code = iput.value;
        var tree = new Parser(code).parse();
        oput.innerHTML = print(t2t(tree));
    });

    combi();
};

