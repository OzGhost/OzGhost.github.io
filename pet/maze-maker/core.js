(function(){
	var verbose = 0;
	var speed = 50;
	var infa = init();
	build(infa);

	function init() {
		var inf = {};
		inf.w = 20;
		inf.h = 12;
		inf.grid = [];
		var root = document.createElement("table");
		document.body.appendChild(root);
		for (var i = 0; i < inf.h; i++) {
			var row = [];
			var tr = document.createElement("tr");
			root.appendChild(tr);
			for (var j=0; j < inf.w; j++) {
				var cell = document.createElement("td");
				row.push(cell);
				tr.appendChild(cell);
			}
			inf.grid.push(row);
		}
		verbose && console.log("__ grid", inf.grid)
		inf.start = genOpen(inf);
		inf.end = genOpen(inf);
		mark(inf.grid, inf.start, "start");
		mark(inf.grid, inf.end, "end");
		return inf;
	}

	function rand(a, b) {
		var gap = b - a;
		return Math.floor(Math.random()*gap) + a;
	}

	function genOpen(inf) {
		switch (rand(0, 4)) {
			case 0:
				return [rand(0, inf.w), 0];
			case 1:
				return [inf.w-1, rand(0, inf.h)];
			case 2:
				return [rand(0, inf.w), inf.h-1];
			case 3:
				return [0, rand(0, inf.h)];
		}
	}

	function mark(grid, coor, tag) {
		var cell = grid[coor[1]][coor[0]];
		if (!cell.hasAttribute("mark")) {
			cell.setAttribute("mark", tag);
		}
	}

	function paint(coor, color, grid) {
		verbose && console.log("__ paint ("+coor[0]+","+coor[1]+")");
		grid[coor[1]][coor[0]].className = color;
	}


	function build(inf) {
		var trace = [inf.start];
		var tidx = 0;
		bloop(trace, tidx, inf);
	}
	
	function bloop(trace, tidx, inf) {
		verbose && console.log("__ from: ", trace[tidx]);
		var next = pick(trace[tidx], inf, tidx);
		verbose && console.log("__ take: ", next);
		unmark(inf.grid, trace[tidx], "head");
		if (next == "!") {
			console.warn("__ stucked! retry ..");
			clear(trace, inf.grid);
			return setTimeout(function(){ bloop([trace[0]], 0, inf); }, speed);
		}
		var ncoor = toCoor(trace[tidx], next);
		trace.push(ncoor);
		paint(ncoor, "dirty", inf.grid);
		mark(inf.grid, ncoor, "head");
		inf.d = next;
		if ((Math.abs(ncoor[1] - inf.end[1]) + Math.abs(ncoor[0] - inf.end[0])) == 1) {
			console.log("__ reach end!");
			return;
		}
		return setTimeout(function(){ bloop(trace, tidx+1, inf); }, speed);
	}

	function unmark(grid, coor, tag) {
		var cell = grid[coor[1]][coor[0]];
		if (tag == cell.getAttribute("mark")) {
			cell.removeAttribute("mark");
		}
	}

	function pick(coor, inf, idx) {
		var d = [];
		var x = coor[0];
		var y = coor[1];
		var piercing = 0;
		if (y-1 >= 0) {
			piercing |= "n" == inf.d;
			if (! inf.grid[y-1][x].className) d.push("n");
		}
		if (y+1 < inf.h) {
			piercing |= "s" == inf.d;
			if (! inf.grid[y+1][x].className) d.push("s");
		}
//	  n
//	w - e
//	  s
		if (x-1 >= 0) {
			piercing |= "w" == inf.d;
			if (! inf.grid[y][x-1].className) d.push("w");
		}
		if (x+1 < inf.w) {
			piercing |= "e" == inf.d;
			if (! inf.grid[y][x+1].className) d.push("e");
		}
		if (d.includes(inf.d)) {
			d.push(inf.d); d.push(inf.d);
		}
		if (d.length) return d[rand(0, d.length)];
		verbose && console.log("__ stucked! try piercing ..", piercing, inf.d);
		if (piercing) return inf.d;
		return "!";
	}

	function toCoor(coor, direction) {
		var x = coor[0];
		var y = coor[1];
		switch (direction) {
			case "n": return [x, y-1];
			case "s": return [x, y+1];
			case "w": return [x-1, y];
			case "e": return [x+1, y];
			default:
				console.error("__ unwanted direction, ", direction);
				return [0, 0]
		}
	}

	function clear(trace, grid) {
		for (var i = 1; i < trace.length; i++) {
			var x = trace[i][0];
			var y = trace[i][1];
			grid[y][x].className = "";
		}
	}
})()
