"use strict";

var canvas;
var gl;
var currentlyPressedKeys = {};

var game;

var playerObj;
var ball;

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

function initObjects() {
  game = new Game();
  playerObj = game.player;
  ball = game.balls[0];
  game.start();
}

function initBuffers(object) {
  object.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(object.vertices),
    gl.STATIC_DRAW
  );
  object.vertexBuffer.itemSize = 2;
  object.vertexBuffer.numItems = 4;

  object.colors = [];
  for (var i = 0; i < 4; i++) {
    object.colors = object.colors.concat(object.color);
  }
  object.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(object.colors),
    gl.STATIC_DRAW
  );
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
  initBuffers(object);
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
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
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

function tick() {
  if (game.shouldTick()) {
    game.handleKeyPresses(currentlyPressedKeys);
    game.checkCollision(function() {
      game.end();
      Swal.fire({
        icon: "error",
        title: "Game over!",
        html: `You have failed to dodge the ball.<br><b>Your score is: ${game.score}</b>`,
        confirmButtonText: "Start a new game",
        onClose: function() {
          console.log('Closed game over!!!');
          initObjects();
        }
      });
    })
    game.animateObjects();
  }
  drawScene();
  updateScore();
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
  resizeCanvasToDisplaySize(canvas, onCanvasSizeChanged);
}

function registerEventListeners() {
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

window.onload = function() {
  canvas = document.getElementById("canvas");
  initObjects();
  initGL();
  registerEventListeners();
  tick();
};
