
var idc = base.length+1;

new Vue({
    el: "#dz",
    data: {
        addition: false,
        books: [base[5], base[6]],
        frame: {},
        keywords: ""
    },
    methods: {
        loadAddition: function() {
            this.frame = Object.assign({}, base[Math.floor(Math.random()*base.length+1)]);
            this.frame.id = idc++;
            this.addition = true;
        },
        add: function() {
            this.books.splice(0, 0, this.frame);
            this.addition = false;
        }
    },
    computed: {
        cookbooks: function() {
            var k = (""+this.keywords).toUpperCase();
            return this.books.filter(function(b){
                return (""+b.title).toUpperCase().includes(k)
            });
        }
    },
});

