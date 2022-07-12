
function draw(radius, center, percent, name) {
  var degree = 300*percent/100;
  var end = getEndOfArc(radius, center, 300);
  var e2 = getEndOfArc(radius, center, degree);
  var e3 = getEndOfArc(radius-2, center, degree);
  var balloon = getEndOfArc(radius-30, center, degree);
  var i1 = getEndOfArc(20, balloon, degree-8);
  var i2 = getEndOfArc(20, balloon, degree+8);
  return '<svg width="' + (center.x + radius + 15)
    + '" height="' + (center.y + radius + 15) + '">'
    + '<style>'
    + '.percent{ font: normal 14px Cantarell; }'
    + '.name{ font: bold 30px Cantarell; }'
    + '</style>'
    + '<circle cx="'+(center.x)+'" cy="'+(center.y+radius)
    + '" r="6" fill="#9ee0e5"/>'
    + '<circle cx="'+(end.x)+'" cy="'+(end.y)+'" r="6" fill="#9ee0e5"/>'
    + drawPath(radius, center, 300, 12, "#9ee0e5")
    + '<circle cx="'+(center.x)+'" cy="'+(center.y+radius)
    + '" r="2" fill="white"/>'
    + '<circle cx="'+(e2.x)+'" cy="'+(e2.y)+'" r="2" fill="white"/>'
    + drawPath(radius, center, degree, 4, "white")
    + '<path d=" M '+i1.x+' '+i1.y
    + ' L ' + e3.x + ' ' + e3.y
    + ' L ' + i2.x + ' ' + i2.y
    + ' A 20 20 0 1 1 ' + i1.x + ' ' + i1.y
    + '" stroke="black" fill="transparent"/>'
    + '<text class="percent" x="'+(balloon.x-14)+'" y="'+(balloon.y+4)+'">'
    + percent+'%</text>'
    + '<text class="name" x="'+(center.x+12)+'" y="'+(center.y+radius+8)+'">'
    + name+'</text>'
    + '</svg>';
};

function drawPath(radius, center, degree, thin, color) {
  return'<path d="'
    + ' M ' + (center.x) + ' ' + (center.y + radius)
    + drawArc(radius, center, degree)
    + '" stroke="'+color+'" stroke-width="'+thin+'" fill="transparent" />';
};

function drawArc(radius, center, degree) {
  var big = degree > 180 ? 1 : 0;
  var end = getEndOfArc(radius, center, degree);
  return ' A ' + (radius) + ' ' + (radius)
    + ' 0 ' +big+ ' 1 '
    + end.x + ' ' + end.y;
};

function drawArcReverse(radius, end, degree) {
  var big = degree > 180 ? 1 : 0;
  return ' A ' + (radius) + ' ' + (radius)
    + ' 0 ' +big+ ' 0 '
    + end.x + ' ' + end.y;
};

function getEndOfArc(radius, center, degree) {
  var p = ((-1)*degree - 90) / 180 * Math.PI;
  var end = {};
  end.x = Math.cos(p)*radius + center.x;
  end.y = (-1)*(Math.sin(p)*radius - center.y);
  return end;
}

var kickass = function() {
  document.getElementById("golang").innerHTML = draw(80, {x:95, y:95}, 38, 'Go');
  document.getElementById("java").innerHTML = draw(80, {x:95, y:95}, 75, 'Java');
  document.getElementById("sql").innerHTML = draw(80, {x:95, y:95}, 60, 'SQL');
};

//window.onload = kickass;

