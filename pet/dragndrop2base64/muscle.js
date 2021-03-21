
var dz = document.getElementById("dz");
var pit = document.getElementById("pit");
var picker = document.getElementById("picker");

var handleFiles = function(files) {
    var pms = [];
    for (var i = 0; i < files.length; i++) {
        (function(){
            var fi = files[i];
            console.log(fi); // check size + type before go on
            pms.push(new Promise(function(rs, rj){
                var r = new FileReader();
                r.onload = function(){ rs(r.result); };
                r.onerror = function(error) { rj(error); };
                r.readAsDataURL(fi);
            }));
        })();
    }
    Promise.all(pms).then(function(vals){
        dz.innerHTML = JSON.stringify(vals, null, 4);
    });
}

pit.addEventListener("drop", function(e){
    e.preventDefault();
    var files = e.dataTransfer.files;
    handleFiles(files);
});
pit.addEventListener("dragover", function(e){e.preventDefault();});
pit.addEventListener("click", function(){picker.click()});

picker.addEventListener("change", function(e){
    handleFiles(e.target.files);
})

