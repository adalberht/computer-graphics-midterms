"use strict";

var canvas;
var gl;
var currentlyPressedKeys = {};

var game;

// Fungsi untuk melakukan inisialisasi shader (kompilasi, link, etc.)
function initializeShaders(gl) {
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  gl.program = program;

  program.resolutionLocation = gl.getUniformLocation(
    program,
    "uResolution"
  );

  program.vertexPositionLocation = gl.getAttribLocation(
    program,
    "aVertexPosition"
  );
  gl.enableVertexAttribArray(program.vertexPositionLocation);

  program.vertexColorLocation = gl.getAttribLocation(
    program,
    "aVertexColor"
  );
  gl.enableVertexAttribArray(program.vertexColorLocation);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
}

// Fungsi yang dipanggil saat user memilih button Demo 
function startDemo() {
  game.startDemo();
  document.getElementById('end-demo').style.visibility = 'visible';
}


// Fungsi yang dipanggil saat user memilih button End Demo dan game over
function endDemo() {
  game.endDemo();
  document.getElementById('end-demo').style.visibility = 'hidden';
  showEndMenu(true);
}

// Fungsi untuk melakukan inisialisasi game menu
function initMenu() {
  Swal.fire({
    icon: "info",
    title: "Welcome to Dodge Ball Game!",
    html: "Use arrow Key to control the player (Green) or press Demo to look at the gameplay.<br><b>Avoid the red balls</b> or it will be game over!",
    showCancelButton: true,
    confirmButtonText: "Start Game",
    cancelButtonText: "Demo"
  }).then(function(result) {
    if (result.value) {
      game.start();
    } else {
      startDemo();
    }
  });
}

// Fungsi untuk melakukan inisialisasi Game
function initGame() {
  game = new Game();
  initMenu();
}

// Fungsi yang dipanggil saat user menekan suatu key
function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}

// Fungsi yang dipanggil saat user melepas suatu key
function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

// Fungsi yang dipanggil untuk menggambar satu buah GameObject ke canvas WebGL
function draw(object) {
  const { vertexBuffer, colorBuffer } = object;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(
    gl.program.vertexPositionLocation,
    vertexBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(object.vertices),
    gl.STATIC_DRAW
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(object.colors),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(
    gl.program.vertexColorLocation,
    colorBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numberOfItems);
}

// Fungsi yang dipanggil setiap kali tick() untuk menggambar seluruh GameObject satu per satu ke canvas
function drawScene() {
  resizeCanvasToDisplaySize(gl.canvas, onCanvasSizeChanged);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  game.objects.forEach(draw);
}

// Fungsi untuk mengupdate skor game ke layar
function updateScore() {
  var scoreDom = document.getElementById("score");
  scoreDom.innerText = `Score: ${game.score}`;
}

// Fungsi untuk menunjukkan menu saat game over / demo selesai
function showEndMenu(demo) {
  Swal.fire({
    icon: demo ? "success" : "error",
    title: demo ? "Demo is over!" : "Game over!",
    html: demo
      ? `Computer has failed to dodge the ball.<br><b>It's score is ${game.score}`
      : `You have failed to dodge the ball.<br><b>Your score is: ${game.score}</b>`,
    confirmButtonText: "Back to Main Menu",
    onClose: function() {
      game.end();
      initGame();
    }
  });
}

// Fungsi main event loop
function tick() {
  if (game.shouldTick()) {
    game.handleKeyPresses(currentlyPressedKeys);
    game.randomizePlayerMovement();
    game.checkCollision(function() {
      var demo = game.demo;
      if (demo) endDemo();
      game.end();
      showEndMenu(demo);
      
    });
    game.animateObjects();
    drawScene();
    updateScore();
  } else {
    drawScene();
  }
  requestAnimFrame(tick);
}

// Callback saat window size berubah (responsive)
function onCanvasSizeChanged() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(
    gl.program.resolutionLocation,
    canvas.width,
    canvas.height
  );
  game.player.updateCanvasProperties(canvas);
}

// Fungsi untuk menginisalisasi WebGL
function initGL() {
  gl = WebGLUtils.setupWebGL(canvas);
  initializeShaders(gl);
}

// Fungsi untuk mendaftarkan event listener
function registerEventListeners() {
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

window.onload = function() {
  canvas = document.getElementById("canvas");
  initGL();
  initGame();
  resizeCanvasToDisplaySize(canvas, onCanvasSizeChanged);
  registerEventListeners();
  tick();
};
