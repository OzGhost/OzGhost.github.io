(function(){
	function loader() {
		var recs = document.getElementsByTagName("td");
		for (var i = 0; i < recs.length; i++) {
			recs[i].addEventListener("click", function(e){
				e.target.className = e.target.className == "ap" ? "" : "ap";
			});
			recs[i].addEventListener("mouseenter", function(e){
				if (e.ctrlKey)
					e.target.className = e.target.className == "ap" ? "" : "ap";
			});
		}
		document.getElementById("counter").addEventListener("click", function(e){
			var np = document.querySelectorAll("td:not(.ap)");
			e.target.innerText = "Count: "+np.length;
		});
	}
	window.onload = loader;
})();
