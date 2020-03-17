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
  handleKeys();
}

function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
  for (var keyCode in currentlyPressedKeys) {
    if (currentlyPressedKeys[keyCode]) {
      game.handleKeyPress(keyCode);
    }
  }
}

// Mengambil bounding dari object
function getBoundingBox(object) {
  let minX, minY, maxX, maxY;
  let width = object.width;
  let height = object.height;
  let originX = object.location[0];
  let originY = object.location[1];

  minX = originX - width / 2;
  maxX = originX + width / 2;
  minY = originY - height / 2;
  maxY = originY + height / 2;

  // normalize min and max
  if (minX > maxX) {
    let temp = maxX;
    maxX = minX;
    minX = temp;
  }
  if (minY > maxY) {
    let temp = maxY;
    maxY = minY;
    minY = temp;
  }
  return [
    [minX, minY],
    [maxX, maxY]
  ];
}

// Berbagai fungsi helper untuk tahu tabrakan atau tidak
// fungsi helper apakah antar objek ada titik yang overlap atau tabrakan
function isSpanOverlap(startA, endA, startB, endB) {
  return startA <= endB && startB <= endA;
}

// Cek apakah objek a dan b tabrakan
function isColliding(bBox_1, bBox_2) {
  let collidesHorizontally = isSpanOverlap(
    bBox_1[0][0],
    bBox_1[1][0],
    bBox_2[0][0],
    bBox_2[1][0]
  );
  let collidesVertically = isSpanOverlap(
    bBox_1[0][1],
    bBox_1[1][1],
    bBox_2[0][1],
    bBox_2[1][1]
  );
  if (collidesHorizontally && collidesVertically) {
    return true;
  } else {
    return false;
  }
}

// Fungsi cek orientasi tabrakan yang mengembailkan arah tabrakan jika tabrakan dan akan mengembalikan undefined ketika obj tidak bertabrakan
function getCollisionOrientation(objA, objB) {
  let objABbox = getBoundingBox(objA);
  let objBBbox = getBoundingBox(objB);

  // Jika Obj tidak ada yang tabrakan tidak lanjut
  if (!isColliding(objABbox, objBBbox)) {
    return undefined;
  }

  // Jika objB tabrakan dikiri, sisi kirinya lebih kiri dari sisi objA
  // Sisi atas objB lebih tinggi dari objA
  if (objBBbox[0][0] < objABbox[0][0] && objBBbox[0][1] < objABbox[1][1])
    return "LEFT";

  // Jika objB tabrakan di kanan, sisi kanannya lebih kanan dari sisi objA
  // dan Sisi atas objB harus lebih tinggi dari objA
  if (objBBbox[1][0] > objABbox[1][0] && objBBbox[0][1] < objABbox[1][1])
    return "RIGHT";

  // Tinggal cek apakah sisi atas objB lebih tinggi dari A jika sudah ketemu tinggal else
  if (objBBbox[0][1] < objABbox[0][1]) {
    return "TOP";
  } else {
    return "BOTTOM";
  }
}

function checkCollision() {
  // Jika kena sisi kiri dari player
  for (var ball of game.balls) {
    let collisionOrientation = getCollisionOrientation(playerObj, ball);
    if (!!collisionOrientation) {
      game.end();
      Swal.fire({
        icon: "error",
        title: "Game over!",
        html: `You have failed to dodge the ball.<br><b>Your score is: ${game.score}</b>`,
        confirmButtonText: "Start a new game",
        onClose: initObjects
      });
    }
  }
  let collisionOrientation = getCollisionOrientation(playerObj, ball);
  if (collisionOrientation === "LEFT") {
    ball.multiplyVelocity([-1.0, 1.0]);
    ball.multiplyVelocity([1.05, 1.05]);

    ball.location[0] =
      playerObj.location[0] - ball.width / 2.0 - playerObj.width / 2.0;
  }
  // Jika kena sisi kanan dari player
  if (collisionOrientation === "RIGHT") {
    ball.multiplyVelocity([-1.0, 1.0]);
    ball.multiplyVelocity([1.05, 1.05]);
    ball.location[0] =
      playerObj.location[0] + ball.width / 2.0 + playerObj.width / 2.0;
  }
  // Jika kena sisi atas dari player
  if (collisionOrientation === "TOP") {
    ball.multiplyVelocity([1.0, -1.0]);
    ball.multiplyVelocity([1.05, 1.05]);
    ball.location[1] =
      playerObj.location[1] - ball.width / 2.0 - playerObj.width / 2.0;
  }
  if (collisionOrientation === "BOTTOM") {
    ball.multiplyVelocity([1.0, -1.0]);
    ball.multiplyVelocity([1.05, 1.05]);
    ball.location[1] =
      playerObj.location[1] + ball.width / 2.0 + playerObj.width / 2.0;
  }

  // Bola Kena Border Atas/Bawah
  if (
    ball.location[1] - ball.height / 2.0 < 0.0 ||
    ball.location[1] + ball.height / 2.0 >= canvas.height
  ) {
    ball.multiplyVelocity([1.0, -1.0]);
  }
  // Bola Kena Border Kanan/kiri
  if (
    ball.location[0] - ball.width / 2.0 < 0.0 ||
    ball.location[0] + ball.width / 2.0 >= canvas.width
  ) {
    ball.multiplyVelocity([-1.0, 1.0]);
  }
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
  const player = game.player;
  const balls = game.balls;
  draw(player);
  for (var ball of balls) {
    draw(ball);
  }
}

function updateScore() {
  var scoreDom = document.getElementById("score");
  scoreDom.innerText = `Score: ${game.score}`;
}

function tick() {
  handleKeys();
  drawScene();
  checkCollision();
  
  animate();
  updateScore();
  requestAnimFrame(tick);
}

var lastTime = 0;

function animate() {
  // if (game.gameOver) return;
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;
    ball.location = add(ball.location, ball.velocity);
  }
  lastTime = timeNow;
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
