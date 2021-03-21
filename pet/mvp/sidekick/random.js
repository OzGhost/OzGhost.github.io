
function randomInRange(a, b) {
  var x = typeof a == 'number' ? a : 0;
  var y = typeof b == 'number' ? b : 0;
  var wide = Math.floor(Math.abs(x - y));
  var ceil = Math.max(x, y);
  var delta = Math.round(Math.random() * ceil * 1000) % (wide + 1);
  return ceil - delta;
}

/**
 * export randomInRange
 */

