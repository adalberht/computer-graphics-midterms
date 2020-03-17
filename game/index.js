"use strict";

var canvas;
var gl;
var currentlyPressedKeys = {};

var game;

function initializeShaders(gl) {
  var shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(shaderProgram);
  gl.program = shaderProgram;

  shaderProgram.resolutionUniformLocation = gl.getUniformLocation(
    shaderProgram,
    "uResolution"
  );

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexColor"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
}

function startDemo() {
  game.startDemo();
  document.getElementById('end-demo').style.visibility = 'visible';
}

function endDemo() {
  game.endDemo();
  document.getElementById('end-demo').style.visibility = 'hidden';
  showEndMenu(true);
}

function initMenu() {
  Swal.fire({
    icon: "info",
    title: "Welcome to Dodge Ball Game!",
    text: "Use arrow Key to control the player (Green) or Demo the game to look at the gameplay",
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

function initGame() {
  game = new Game();
  initMenu();
}

function initBuffers(object) {
  object.vertexBuffer = gl.createBuffer();
  object.vertexBuffer.itemSize = 2;
  object.vertexBuffer.numItems = 4;
  object.colorBuffer = gl.createBuffer();
  object.colorBuffer.itemSize = 4;
  object.colorBuffer.numItems = 1;
}

function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function draw(object) {
  const { vertexBuffer, colorBuffer } = object;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(
    gl.program.vertexPositionAttribute,
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
    gl.program.vertexColorAttribute,
    colorBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numItems);
}

function drawScene() {
  resizeCanvasToDisplaySize(gl.canvas, onCanvasSizeChanged);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  game.objects.forEach(draw);
}

function updateScore() {
  var scoreDom = document.getElementById("score");
  scoreDom.innerText = `Score: ${game.score}`;
}

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

function onCanvasSizeChanged() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(
    gl.program.resolutionUniformLocation,
    canvas.width,
    canvas.height
  );
  game.player.updateCanvasProperties(canvas);
}

function initGL() {
  gl = WebGLUtils.setupWebGL(canvas);
  initializeShaders(gl);
}

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
