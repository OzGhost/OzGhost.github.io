
new Vue({
    el: '#dz',
    data: {
        d: [
            {
                id: 1,
                val: 6,
                name: 'Math',
                color: 'red'
            },
            {
                id: 2,
                val: 5.5,
                name: 'Literature',
                color: 'blue'
            },
            {
                id: 3,
                val: 3,
                name: 'Physics',
                color: '#33cc33'
            },
            {
                id: 4,
                val: 1,
                name: 'Chemistry',
                color: 'orange'
            },
            {
                id: 5,
                val: 3,
                name: 'English',
                color: 'black'
            }
        ]
    },
    computed: {
        cooked: function() {
            var lanew = 100/this.d.length;
            var rodw = lanew*4/6;
            var halfGap = lanew/6;
            var gap = halfGap*2;
            var item = undefined;
            var i = 0;
            var ub = 0;
            
            for (i = 0; i < this.d.length; i++) {
                item = this.d[i];
                if (item.val > ub) ub = item.val;
            }

            var lanes = [];
            var offset = halfGap;
            var ih = 0;
            for (i = 0; i < this.d.length; i++) {
                item = this.d[i];
                ih = 95 * (item.val/ub);
                lanes.push({
                    i: item.id,
                    n: item.name,
                    v: item.val,
                    c: item.color,
                    w: rodw + '%',
                    l: offset + '%',
                    h: ih + '%'
                });
                offset = offset + rodw + gap;
            }
            return lanes;
        },
        rails: function() {
            var ub = 0;
            var item = undefined;
            var i = 0;
            for (i = 0; i < this.d.length; i++) {
                item = this.d[i];
                if (item.val > ub) ub = item.val;
            }
            var v = ''+Math.floor(ub);
            var unit = Math.pow(10, v.length-1);
            var ounit = unit;
            if (ub/(ounit/2) <= 10) unit = ounit / 2;
            if (ub/(ounit*3/10) <= 10) unit = ounit * 3 / 10;
            if (ub/(ounit/10) <= 10) unit = ounit / 10;
            var uh = 95 * (unit/ub);
            var hs = [];
            var stock = uh;
            while (stock < 100) {
                hs.push(uh);
                stock += uh;
            }
            if (stock-uh < 100) {
                hs.push(100-stock+uh);
            }
            var rails = [];
            for (i = hs.length-1; i >=0; i--) {
                rails.push({
                    i: i,
                    h: hs[i] + '%',
                    l: Math.round(i * unit * 10) / 10
                });
            }
            return rails;
        }
    },
    methods: {
        mess: function() {
            var ctx = this;
            function runTheMess() {
                for (var i = 0; i < ctx.d.length; i++) {
                    ctx.d[i].val = Math.floor(Math.random()*1000000 % 250000) / 100;
                }
            }
            setInterval(runTheMess, 1000);
        }
    }
});

