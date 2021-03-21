
var COUNTER_PART = {
    "{": "}",
    "(": ")"
};

var QUOTE = {
    "(": true,
    ")": true,
    "{": true,
    "}": true
};

var KEYWORD = {
    "if": true,
    "else": true
};

var Scanner = function(codeBase) {
    var _this = this;
    _this.code = codeBase;
    _this.len = codeBase.length;
    _this.cindex = 0;
    _this.next = function() {
        _this.roll();
        var i = _this.cindex;
        if (i >= _this.len) {
            return "";
        }
        if (_this.code[i] == '(') {
            _this.rollTo(')');
        } else {
            _this.scan();
        }
        var j = _this.cindex;
        return _this.code.substring(i,j).replace(/\\(?=[\(\)])/g, "");
    };
    _this.roll = function() {
        var i = _this.cindex;
        while (i < _this.len && (_this.code[i] == ' ' || _this.code[i] == '\n')) {
            ++i;
        }
        _this.cindex = i;
    };
    _this.scan = function() {
        var i = _this.cindex;
        while (i < _this.len) {
            var c = _this.code[i];
            if (c == ' ' || c == '\n') {
                break;
            }
            if (_this.isQuote(i)) {
                break;
            }
            ++i;
        }
        if (_this.cindex == i) { // lead by quote
            _this.cindex = i + 1;
        } else {
            _this.cindex = i;
        }
    };
    _this.isQuote = function(i) {
        for (var q in QUOTE) {
            if (_this.isNonEscaped(i, q)) {
                return true;
            }
        }
        return false;
    };
    _this.rollTo = function(ch) {
        var i = _this.cindex;
        while (i < _this.len && !_this.isNonEscaped(i, ch)) {
            ++i;
        }
        _this.cindex = i;
        if (_this.cindex < _this.len) {
            _this.cindex++;
        }
    };
    _this.isNonEscaped = function(index, ch) {
        if (_this.code[index] != ch) {
            return false;
        }
        if (index == 0) {
            return true;
        }
        if (_this.code[index-1] == '\\') {
            return false;
        }
        return true;
    };
    _this.readUntil = function(ch) {
        var i = _this.cindex;
        var j = _this.cindex;
        while (j < _this.len && ! _this.isNonEscaped(j, ch)) {
            ++j;
        }
        _this.cindex = j;
        return _this.code.substring(i, j);
    };
    return _this;
};

var Lexer = function(codeBase) {
    var _this = this;
    _this.scanner = new Scanner(codeBase);
    _this.pre = undefined;
    _this.next = function() {
        var x = _this.scanner.next();
        var previous = _this.pre;
        _this.pre = x;
        if ( ! x) {
            return {};
        }
        if (KEYWORD[x]) {
            return {
                type: "keyword",
                value: x
            };
        }
        if (QUOTE[x]) {
            return {
                type: "bracket",
                value: x
            };
        }
        if (x[0] == "(") {
            if (x[x.length-1] == ")") {
                return {
                    type: "quoted",
                    value: x.substring(1, x.length-1)
                };
            }
            if (previous == "{") {
                return {
                    type: "words",
                    value: x
                }
            }
            throw "Missing ')' in <"+x+">";
        }
        if (previous == "{") {
            x += _this.scanner.readUntil("}");
            _this.pre = x;
            return {
                type: "words",
                value: x
            };
        }
        return {
            type: "word",
            value: x
        };
    };
    return _this;
};

var Parser = function(codeBase) {
    var _this = this;
    _this.lexer = new Lexer(codeBase);
    _this.tokens = [];
    _this.cindex = 0;
    _this.parse = function() {
        var x = _this.lexer.next();
        if (x.value != "if") {
            throw "Expect 'if' but was <" + x.value + ">";
        }
        var tokens = [];
        while (x.type) {
            tokens.push( x );
            x = _this.lexer.next();
        }
        _this.tokens = tokens;
        _this.cindex = 1;
        var root = _this.load();
        return root;
    };
    _this.next = function(){
        var tk =  _this.tokens[_this.cindex++];
        if (!tk) {
            return {};
        }
        return tk;
    };
    _this.load = function() {
        var root = {};
        var x = _this.next();
        if (x.type != "quoted") {
            throw "Expect '(some condition)' but was <"+x.value+">";
        }
        root.test = x.value;
        x = _this.next();
        if (x.value != "{") { // must have close bracket
            throw "Expect '{' but was <"+x.value+">";
        }
        x = _this.next();
        if (x.type == "words") {
            root.fit = x.value;
        } else if (x.value == "if") {
            root.fit = _this.load();
        } else {
            throw "Expect a statement or a condition block but was <"+x.value+">";
        }
        x = _this.next();
        if (x.value != "}") {
            throw "Expect '}' but was <"+x.value+">";
        }
        x = _this.next();
        if (x.value != "else") {
            _this.cindex--;
            return root;
        }
        // else load
        x = _this.next();
        var elseWithBracket = false;
        if (x.value == "{") {
            x = _this.next(); // skip open bracket
            elseWithBracket = true;
        }
        if (x.type == "words") {
            root.ow = x.value;
        } else if (x.value == "if") {
            root.ow = _this.load();
        } else {
            throw "Expect a statement or a condition block but was <"+x.value+">";
        }
        x = _this.next();
        if (elseWithBracket) {
            if (x.value != "}") { // must have close bracket
                throw "Expect '}' but was <"+x.value+">";
            }
        } else {
            _this.cindex--;
        }
        return  root;
    };
    _this.reconnect = function(nodes) {
        if (nodes.length != 2 || nodes[0].type != "if" || nodes[1].type != "else") {
            throw "Broken structure";
        }
        nodes[0].otherwise = nodes[1].fit;
        return nodes[0];
    };
    return _this;
};

