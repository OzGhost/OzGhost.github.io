var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var ceil = 1000;
var source;

//set up the different audio nodes we will use for the app

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var biquadFilter = audioCtx.createBiquadFilter();

var drawVisual;

function load() {
  
  biquadFilter.type = "bandpass";

   var audioTag = document.getElementById("audioTag");
   source = audioCtx.createMediaElementSource(audioTag);

   source.connect(biquadFilter);
   biquadFilter.connect(analyser);
   //biquadFilter.connect(audioCtx.destination);
   source.connect(audioCtx.destination);

	 visualize();
};

window.onload = load;

function kick(val) {
  document.body.innerHTML += '<p>Hit'+val+'</p>';
}

function visualize() {

  analyser.fftSize = 256;
  var bufferLengthAlt = analyser.frequencyBinCount;
  var dataArrayAlt = new Uint8Array(bufferLengthAlt);

  var drawAlt = function() {
    drawVisual = requestAnimationFrame(drawAlt);

    analyser.getByteFrequencyData(dataArrayAlt);

    var barHeight = dataArrayAlt[0];
    if (barHeight > ceil)
      kick(barHeight);
  };
  drawAlt();
}

var frequenceControl_onchange = function() {
  var val = document.getElementById("fControl").value;
  console.log("update frequency to " + val);
    biquadFilter.frequency.value = val;
};

var biquadType_onchange = function(e) {
  var val = e.target.value;
  console.log(val);
  biquadFilter.type = val;
};

