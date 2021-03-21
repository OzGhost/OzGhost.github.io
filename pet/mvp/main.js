var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioTag = document.getElementById("audioTag");
var n_seed = 40;
var seeds = [];
var trees = [];
var treeHeight = [];
var growSpeed = [];
var filter = "lowpass";
var ceil = 180;
var source;
var win_width = window.innerWidth;
var win_heigh = window.innerHeight;
var baseSpeed = 1;
var underground = -12;

//set up the different audio nodes we will use for the app

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var biquadFilter = audioCtx.createBiquadFilter();

var drawVisual;
var seedinger;

function kickass() {
  seedsInit();
  treesInit();
  seeding();
  sourceEstablish();

  document.getElementById('fb').addEventListener('change', fileComming);
};

function seedsInit() {
  for (let i = 0; i < n_seed; i++)
    seeds[i] = 0;
}

function treesInit() {
  for (let i = 0; i < n_seed; i++) {
    trees[i] = document.createElement('SPAN');
    treeHeight[i] = underground;
    growSpeed[i] = 1;
    document.body.appendChild(trees[i]);
  }
}

function seeding() {
  var hole = randomInRange(0, n_seed - 1);
  if ( ! seeds[hole]) {
    var size = randomInRange(1, 3);
    seeds[hole] = 1;
    trees[hole].className = 'w'+(size * 3);
    growSpeed[hole] = size * 0.25 + 0.5;
    trees[hole].style.left = randomInRange(0, win_width)+'px';
  }
  seedinger = setTimeout(seeding, randomInRange(500, 2000));
}

function sourceEstablish() {
  biquadFilter.type = filter;

  source = audioCtx.createMediaElementSource(audioTag);

  source.connect(biquadFilter);
  biquadFilter.connect(analyser);
  //biquadFilter.connect(audioCtx.destination);
  source.connect(audioCtx.destination);

  visualize();
}


function visualize() {

  analyser.fftSize = 256;
  var bufferLengthAlt = analyser.frequencyBinCount;
  var dataArrayAlt = new Uint8Array(bufferLengthAlt);

  var drawAlt = function() {
    drawVisual = requestAnimationFrame(drawAlt);

    analyser.getByteFrequencyData(dataArrayAlt);

    var barHeight = dataArrayAlt[0];
    if (barHeight > ceil) {
      baseSpeed = 4;
      if (randomInRange(0, 9) < 2) {
        clearTimeout(seedinger);
        seeding();
      }
    } else
      baseSpeed = 1;
    growTrees();
  };
  drawAlt();
}

function growTrees() {
  for (let i = 0; i < n_seed; i++) {
    if ( ! seeds[i])
      continue;
    treeHeight[i] += (growSpeed[i] * baseSpeed);
    if (treeHeight[i] > win_heigh) {
      seeds[i] = 0;
      treeHeight[i] = underground;
      trees[i].style.left = randomInRange(0, win_width);
    }
    trees[i].style.bottom = treeHeight[i]+'px';
  }
}

function fileComming() {
  if ( ! this.files || ! this.files[0] )
    return;
  var fr = new FileReader();
  fr.onload = function(event) {
    audioTag.innerHTML = '';
    audioTag.src = event.target.result
    audioTag.play();
  }
  fr.readAsDataURL(this.files[0]);
}

window.onload = kickass;
