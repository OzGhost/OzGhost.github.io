"use strict";
var rand = function(min, max){
    return Math.round(Math.random() * (max - min + 1)) + min;
};
var format2d = function(n){
    if (typeof n == "string") return n;
    return (n < 10) ? ("0" + n) : (n);
};
var $star = (function(){
    var fly = function(tagID){
        // reset style
        $(tagID).removeAttr("style", "");
        var maxWidth = $("#bodyguard").width();
        var x = rand(1, $("#bodyguard").height());
        // random star size
        if (x%2 == 0){
            $(tagID).css("border-width", "2px");
        } else {
            $(tagID).css("border-width", "1px");
        }
        // random star position
        $(tagID).css("top", x+"px");
        // random star speed
        x = rand(5, 15) * (rand(1, maxWidth) / 100);
        $(tagID).css("animation", "fly "+x+"s linear");
        // random turn on another star
        setTimeout(function(){
            $star.fly("#st" + format2d(rand(1, 25)));
        }, rand(0, 5) * 1000);
    };

    return {
        fly: fly
    }
}());

// static time
var timer = {
    hours: 0,
    minutes: 0,
    seconds: 0
};
// get system time
var date = new Date();
timer.hours = date.getHours();
timer.minutes = date.getMinutes();
timer.seconds = date.getSeconds();

var panel = (function(){
    var initClock = function(){
        panel.upDigit("#hour", timer.hours);
        panel.upDigit("#minute", timer.minutes);
        panel.upDigit("#second", timer.seconds);
        panel.upDate();
        setTimeout(function(){
            panel.upTime();
        }, 1000);
    };
    var updateTime = function(){
        timer.seconds++;
        if (timer.seconds >= 60){
            timer.seconds %= 60;
            timer.minutes++;
            if (timer.minutes >= 60){
                timer.minutes %= 60;
                timer.hours++;
                if (timer.hours >= 24){
                    timer.hours %= 24;
                    panel.upDate();
                }
                panel.upDigit("#hour", timer.hours);
            }
            panel.upDigit("#minute", timer.minutes);
        }
        panel.upDigit("#second", timer.seconds);
        // loop for next second
        setTimeout(function(){
            panel.upTime();
        }, 1000);
    };
    var updateDate = function(){
        var dater = new Date();
        $(".date-panel li").addClass("changing");
        $("#year").text(dater.getFullYear());
        $("#month").text(format2d( parseInt(dater.getMonth()) + 1 ));
        $("#date").text(format2d(dater.getDate()));
        setTimeout(function(){
            $(".date-panel li").removeAttr("class");
        }, 1000);
    };
    // update digit
    var updateDigit = function(id, val){
        $(id).addClass("changing");
        setTimeout(function(){
            $(id+" > div").text(format2d(val));
            $(id).removeAttr("class");
        }, 400);
    };
    return {
        upTime: updateTime,
        upDigit: updateDigit,
        initClock: initClock,
        upDate: updateDate
    }
}());

var myDate = (function(){
    var date = 0;
    var month = 0;
    var year = 0;
    var day = 0;
    var create = function(d){
        this.date = d.getDate()*1;
        this.month = d.getMonth()*1 + 1;
        this.year = d.getFullYear()*1;
        this.day = d.getDay()*1;
        if (this.day == 0)
            this.day = 7;
    };
    var log = function(){
        console.log(this.day);
        console.log(this.date);
        console.log(this.month);
        console.log(this.year);
    };
    var isPrimeYear = function(y){
        if (y % 400 == 0) return true;
        if ( (y % 4 == 0) && (y%100 != 0) ) return true;
        return false;
    };
    var maxNumberOfDate = function(m, y){
        switch (m){
            case 2:
                return (myDate.isPrimeYear(y)) ? 29 : 28;
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            default:
                return 0;
        }
    };
    var tailOfMonth = function(){
        return myDate.maxNumberOfDate(this.month, this.year);
    };
    var initCalendar = function(id){
        var rs = document.createElement("table");
        var mon = [];
        var week = [];

        var tmpBefore = this.date - 1;
        var tmpAfter = this.date + 1;
        var max = myDate.tailOfMonth();

        // push today into week
        week.push(this.date);

        // push another date behind today into week
        for (var i = (this.day + 1); (i <= 7) && (tmpAfter <= max); i++) {
            week.push(tmpAfter);
            tmpAfter++;
        }

        // collect remain date of week
        for (var i = (this.day - 1); (i >= 1) && (tmpBefore >= 1); i--){
            week.unshift(tmpBefore);
            tmpBefore--;
        }

        // push week to month
        mon.push(week);
        // renew week
        week = [];

        for (var i = mon.length; i >= 0; i--){
            for (var j = mon[i].length; j >= 0; j--){
                console.log(mon[i][j]);
            }
        }
        // // push matrix to table
        // for (var i in mon){
        //     var tmpRow = document.createElement("tr");
        //     for (var j in i){
        //         // tmpRow.appendChild(j);
        //         console.log(j);
        //     }
        //     rs.appendChild(tmpRow);
        // }

        // bring whole table to the scene
        document.getElementById(id).appendChild(rs);
    };
    return {
        create: create,
        log: log,
        maxNumberOfDate: maxNumberOfDate,
        isPrimeYear: isPrimeYear,
        tailOfMonth: tailOfMonth,
        initCalendar: initCalendar
    }
}());

// close dialog
$(document).on('click', '.dialog h2', function(){
    $(this).parent().addClass("gaw");
    setTimeout(function(){
        $('.dialog').addClass("hide").removeClass("gaw");
        $("body").removeClass("back");
    }, 500);
});

// handle blow up clicked event
$(document).on('click', '[ft="blow-it-up"]', function(e){
    e.preventDefault();
    $("body").addClass("back");
    $( $(this).attr("href") ).removeClass("hide");
});

$(document).ready(function(){
    $star.fly("#st01");
    panel.initClock();
    myDate.create(new Date());
    myDate.initCalendar("calendar");
});

