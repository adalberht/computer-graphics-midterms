var debug = 0;

var gl;
var shaderProgram;
var resolution;
var mvMatrix;
var drawingMVMatrices = [];
var drawingVertexBuffers = [];
var drawingColorBuffers = [];
var currentlyPressedKeys = {};

var playerObj;
var ball;
var balls = [];
var allObj = [];

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        resolution = [canvas.width, canvas.height, 1.0];
    } catch (e) {}
    if (!gl) {
        alert("Could not initialize WebGL, sorry :-(");
    }
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    gl.useProgram(shaderProgram);
    shaderProgram.resolutionUniform = gl.getUniformLocation(shaderProgram, "uResolution") // Resolution

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms() {
    gl.uniform2f(shaderProgram.resolutionUniform, canvas.width, canvas.height); // Resolution
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function initObjects() {
    playerObj = new Player([400.0, 50.0, 0.0], [0.0, 1.0, 0.0, 1.0]);
    ball = new Ball([250.0, 250.0, 0.0], [0.0, 0.0, 1.0, 1.0]);
    balls.push(ball);
}

function initBuffers(object) {
    object.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
    object.vertexBuffer.itemSize = 2;
    object.vertexBuffer.numItems = 4;

    object.colors = [];
    for (var i = 0; i < 4; i++) {
        object.colors = object.colors.concat(object.color);
    }
    object.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
    object.colorBuffer.itemSize = 4;
    object.colorBuffer.numItems = 4;

    drawingMVMatrices.push(object.mvMatrix);
    drawingVertexBuffers.push(object.vertexBuffer);
    drawingColorBuffers.push(object.colorBuffer);
}

function refillBuffers(object) {
    drawingMVMatrices.push(object.mvMatrix);
    drawingVertexBuffers.push(object.vertexBuffer);
    drawingColorBuffers.push(object.colorBuffer);
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        mat4.translate(playerObj.mvMatrix, normalToClip([0.0, -playerObj.velocity, 0.0]));
        playerObj.location = vec3.add(playerObj.location, [0.0, -playerObj.velocity, 0.0]);
    }
    if (currentlyPressedKeys[39]) {
        // Right cursor key
        mat4.translate(playerObj.mvMatrix, normalToClip([playerObj.velocity, 0.0, 0.0]));
        playerObj.location = vec3.add(playerObj.location, [playerObj.velocity, 0.0, 0.0]);
    }
    if (currentlyPressedKeys[37]) {
        // Left cursor key
        mat4.translate(playerObj.mvMatrix, normalToClip([-playerObj.velocity, 0.0, 0.0]));
        playerObj.location = vec3.add(playerObj.location, [-playerObj.velocity, 0.0, 0.0]);
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        mat4.translate(playerObj.mvMatrix, normalToClip([0.0, playerObj.velocity, 0.0]));
        playerObj.location = vec3.add(playerObj.location, [0.0, playerObj.velocity, 0.0]);
    }
}

function checkCollision() {
    // Apakah sudah sampai pinggir canvas atau belum untuk atas dan bawah
    // Menyentuh border atas
    if (playerObj.location[1] - (playerObj.height / 2.0) <= 0) {
        mat4.translate(playerObj.mvMatrix, normalToClip([0, (playerObj.height / 2.0) - playerObj.location[1], 0]));
        playerObj.location[1] = (playerObj.height / 2.0);
    }
    // Sudah menyentuh border bawah
    if (playerObj.location[1] + (playerObj.height / 2.0) >= canvas.height) {
        mat4.translate(playerObj.mvMatrix, normalToClip([0, canvas.height - (playerObj.location[1] + (playerObj
            .height / 2.0)), 0]));
        playerObj.location[1] = canvas.height - (playerObj.height / 2.0);
    }
    // Apakah sudah sampai pinggir canvas atau belum untuk kanan dan kiri
    // Menyentuh Kanan
    if (playerObj.location[0] - (playerObj.width / 2.0) <= 0) {
        mat4.translate(playerObj.mvMatrix, normalToClip([(playerObj.width / 2.0) - playerObj.location[0], 0, 0]));
        playerObj.location[0] = (playerObj.width / 2.0);
    }
    // Menyentuh kiri
    if (playerObj.location[0] + (playerObj.width / 2.0) >= canvas.width) {
        mat4.translate(playerObj.mvMatrix, normalToClip([canvas.width - (playerObj.location[0] + (playerObj.width / 2.0)), 0, 0]));
        playerObj.location[0] = canvas.width - (playerObj.width / 2.0);
    }

    // Jika kena sisi kiri dari player
    if (Math.abs(ball.location[0] - playerObj.location[0]) <= (ball.width / 2.0) + (playerObj.width / 2.0) &&
        ball.location[0] - playerObj.location[0] <= 0 &&
        Math.abs(ball.location[1] - playerObj.location[1]) <= (ball.height / 2.0) + (playerObj.height / 2.0)) {
        vec3.multiply(ball.velocity, [-1.0, 1.0, 1.0]);
        vec3.multiply(ball.velocity, [1.05, 1.05, 1.0]);
        mat4.translate(ball.mvMatrix, normalToClip([-(((ball.width / 2.0) + (playerObj.width / 2.0)) - Math.abs(ball
            .location[0] - playerObj.location[0])), 0, 0]));
        ball.location[0] = playerObj.location[0] - (ball.width / 2.0) - (playerObj.width / 2.0);
    }
    // Jika kena sisi kanan dari player
    if (Math.abs(ball.location[0] - playerObj.location[0]) <= (ball.width / 2.0) + (playerObj.width / 2.0) &&
        ball.location[0] - playerObj.location[0] >= 0 &&
        Math.abs(ball.location[1] - playerObj.location[1]) <= (ball.height / 2.0) + (playerObj.height / 2.0)) {
        vec3.multiply(ball.velocity, [-1.0, 1.0, 1.0]);
        vec3.multiply(ball.velocity, [1.05, 1.05, 1.0]);
        mat4.translate(ball.mvMatrix, normalToClip([(((ball.width / 2.0) + (playerObj.width / 2.0)) - Math.abs(ball
            .location[0] - playerObj.location[0])), 0, 0]));
        ball.location[0] = playerObj.location[0] + (ball.width / 2.0) + (playerObj.width / 2.0);
    }
    // Jika kena sisi atas dari player
    if (Math.abs(ball.location[1] - playerObj.location[1]) <= (ball.height / 2.0) + (playerObj.height / 2.0) &&
        ball.location[1] - playerObj.location[1] >= 0 &&
        Math.abs(ball.location[0] - playerObj.location[0]) <= (ball.width / 2.0) + (playerObj.width / 2.0)) {
        vec3.multiply(ball.velocity, [1.0, -1.0, 1.0]);
        vec3.multiply(ball.velocity, [1.05, 1.05, 1.0]);
        mat4.translate(ball.mvMatrix, normalToClip([0, (((ball.height / 2.0) + (playerObj.height / 2.0)) - Math.abs(ball
            .location[1] - playerObj.location[1])), 0]));
        ball.location[1] = playerObj.location[1] + (ball.width / 2.0) + (playerObj.width / 2.0);
        console.log("sasa")
    }
    
    // Bola Kena Border Atas/Bawah
    if ((ball.location[1] - (ball.height / 2.0)) < 0.0 || (ball.location[1] + (ball.height / 2.0)) >= canvas.height) {
        vec3.multiply(ball.velocity, [1.0, -1.0, 1.0]);
    }
    // Bola Kena Border Kanan/kiri
    if ((ball.location[0] - (ball.width / 2.0)) < 0.0 || (ball.location[0] + (ball.width / 2.0)) >= canvas.height) {
        vec3.multiply(ball.velocity, [-1.0, 1.0, 1.0]);
    }
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexBuffer;
    var colorBuffer;
    for (var i = drawingVertexBuffers.length; i > 0; i--) {
        mvMatrix = drawingMVMatrices.pop();
        vertexBuffer = drawingVertexBuffers.pop();
        colorBuffer = drawingColorBuffers.pop();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexBuffer.numItems);
    }
}

function normalToClip(src) {
    var zeroToOne = vec3.divide(src, resolution);
    var zeroToTwo = vec3.multiply(zeroToOne, [2.0, 2.0, 2.0]);
    var dest = vec3.multiply(zeroToTwo, [1.0, -1.0, 0.0]);
    return dest;
}

function tick() {
    requestAnimFrame(tick);
    handleKeys();
    checkCollision();
    drawScene();
    if (debug == 1)
        drawDebug();
    animate();
}

var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        mat4.translate(ball.mvMatrix, normalToClip(Object.create(ball.velocity)));
        ball.location = vec3.add(ball.location, ball.velocity);
    }
    lastTime = timeNow;

    refillBuffers(playerObj);
    refillBuffers(ball);
}

function drawDebug() {
    // Add Debug here
}

function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();
    initObjects();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    tick();
}

// Kelas yang dibutuhkan
// Kelas Player untuk pembuatan player
class Player {
    constructor(locStart, color) {
        this.location = Object.create(locStart);
        this.width = 50;
        this.height = 50;

        this.velocity = 4.0;

        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, normalToClip(Object.create(locStart)));

        this.vertices = [
            -25.0, 25.0,
            25.0, 25.0,
            -25.0, -25.0,
            25.0, -25.0
        ];
        this.color = color;
        initBuffers(this);
    }
}

// Kelas Bola untuk handle pembuatan bola
class Ball {
    constructor(locStart, color) {
        this.location = Object.create(locStart);
        this.width = 20;
        this.height = 20;

        this.velocity = [-1.0, -1.0, 0.0];

        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, normalToClip(Object.create(locStart)));

        this.vertices = [
            -10.0, 10.0,
            10.0, 10.0,
            -10.0, -10.0,
            10.0, -10.0
        ];
        this.color = color;
        initBuffers(this);
    }
}