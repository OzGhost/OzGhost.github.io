window.onload = function(){
    var iid = 10;
    var app = new Vue({
        el: '#frame',
        data: {
            bars: [],
            val: "c,g"
        },
        methods: {
            submit: function() {
                var v = this.val;
                this.val = "d,j";
                v = v.split(",");
                var airingVals = [];
                for (var i = 0; i < v.length; i++) {
                    airingVals.push({id: iid++, name: v[i], delivering: true});
                }
                var viewVals = [];
                for (var i = 0; i < airingVals.length; i++) {
                    viewVals.push(JSON.parse(JSON.stringify(airingVals[i])));
                }
                for (var i = 0; i < viewVals.length; i++) {
                    this.bars.push(viewVals[i]);
                }
                this.bars.sort(function(a, b){
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    return 0;
                });
                for (var i = 0; i < airingVals.length; i++) {
                    (function(){
                        var j = i;
                        airingVals.hiden = "hide me away";
                        setTimeout(function(){
                            // reload response to view object
                            viewVals[j].delivering = false;
                        }, 5000 * Math.random());
                    })();
                }
            }
        }
    })
};
