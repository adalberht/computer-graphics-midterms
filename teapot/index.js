"use strict";

var numDivisions = 3;
var cameraBefore;

var index = 0;

var points = [];
var normals = [];

var modelViewMatrix = [];
var modelViewMatrixLoc;
var projectionMatrix = [];
var projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var axis = 0;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];
var dTheta = 5.0;

var flag = true;

var animationController = new AnimationController();

var cameraController = new CameraController();

var perspectiveSettings;

var program;
var canvas, render, gl;

var bezier = function (u) {
  var b = new Array(4);
  var a = 1 - u;
  b[3] = a * a * a;
  b[2] = 3 * a * a * u;
  b[1] = 3 * a * u * u;
  b[0] = u * u * u;
  return b;
};

var nbezier = function (u) {
  var b = [];
  b.push(3 * u * u);
  b.push(3 * u * (2 - 3 * u));
  b.push(3 * (1 - 4 * u + 3 * u * u));
  b.push(-3 * (1 - u) * (1 - u));
  return b;
};

function initializeTeapot() {
  var sum = [0, 0, 0];
  for (var i = 0; i < 306; i++)
    for (j = 0; j < 3; j++) sum[j] += vertices[i][j];
  for (j = 0; j < 3; j++) sum[j] /= 306;
  for (var i = 0; i < 306; i++)
    for (j = 0; j < 2; j++) vertices[i][j] -= sum[j] / 2;
  for (var i = 0; i < 306; i++)
    for (j = 0; j < 3; j++) vertices[i][j] *= 2;

  var h = 1.0 / numDivisions;

  var patch = new Array(numTeapotPatches);
  for (var i = 0; i < numTeapotPatches; i++) patch[i] = new Array(16);
  for (var i = 0; i < numTeapotPatches; i++)
    for (j = 0; j < 16; j++) {
      patch[i][j] = vec4([
        vertices[indices[i][j]][0],
        vertices[indices[i][j]][2],
        vertices[indices[i][j]][1],
        1.0
      ]);
    }

  for (var n = 0; n < numTeapotPatches; n++) {
    var data = new Array(numDivisions + 1);
    for (var j = 0; j <= numDivisions; j++)
      data[j] = new Array(numDivisions + 1);
    for (var i = 0; i <= numDivisions; i++)
      for (var j = 0; j <= numDivisions; j++) {
        data[i][j] = vec4(0, 0, 0, 1);
        var u = i * h;
        var v = j * h;
        var t = new Array(4);
        for (var ii = 0; ii < 4; ii++) t[ii] = new Array(4);
        for (var ii = 0; ii < 4; ii++)
          for (var jj = 0; jj < 4; jj++)
            t[ii][jj] = bezier(u)[ii] * bezier(v)[jj];

        for (var ii = 0; ii < 4; ii++)
          for (var jj = 0; jj < 4; jj++) {
            temp = vec4(patch[n][4 * ii + jj]);
            temp = scale(t[ii][jj], temp);
            data[i][j] = add(data[i][j], temp);
          }
      }

    var ndata = new Array(numDivisions + 1);
    for (var j = 0; j <= numDivisions; j++)
      ndata[j] = new Array(numDivisions + 1);
    var tdata = new Array(numDivisions + 1);
    for (var j = 0; j <= numDivisions; j++)
      tdata[j] = new Array(numDivisions + 1);
    var sdata = new Array(numDivisions + 1);
    for (var j = 0; j <= numDivisions; j++)
      sdata[j] = new Array(numDivisions + 1);
    for (var i = 0; i <= numDivisions; i++)
      for (var j = 0; j <= numDivisions; j++) {
        ndata[i][j] = vec4(0, 0, 0, 0);
        sdata[i][j] = vec4(0, 0, 0, 0);
        tdata[i][j] = vec4(0, 0, 0, 0);
        var u = i * h;
        var v = j * h;
        var tt = new Array(4);
        for (var ii = 0; ii < 4; ii++) tt[ii] = new Array(4);
        var ss = new Array(4);
        for (var ii = 0; ii < 4; ii++) ss[ii] = new Array(4);

        for (var ii = 0; ii < 4; ii++)
          for (var jj = 0; jj < 4; jj++) {
            tt[ii][jj] = nbezier(u)[ii] * bezier(v)[jj];
            ss[ii][jj] = bezier(u)[ii] * nbezier(v)[jj];
          }

        for (var ii = 0; ii < 4; ii++)
          for (var jj = 0; jj < 4; jj++) {
            var temp = vec4(patch[n][4 * ii + jj]);
            temp = scale(tt[ii][jj], temp);
            tdata[i][j] = add(tdata[i][j], temp);

            var stemp = vec4(patch[n][4 * ii + jj]);
            stemp = scale(ss[ii][jj], stemp);
            sdata[i][j] = add(sdata[i][j], stemp);
          }
        temp = cross(tdata[i][j], sdata[i][j]);

        ndata[i][j] = normalize(vec4(temp[0], temp[1], temp[2], 0));
      }

    for (var i = 0; i < numDivisions; i++)
      for (var j = 0; j < numDivisions; j++) {
        points.push(data[i][j]);
        normals.push(ndata[i][j]);

        points.push(data[i + 1][j]);
        normals.push(ndata[i + 1][j]);

        points.push(data[i + 1][j + 1]);
        normals.push(ndata[i + 1][j + 1]);

        points.push(data[i][j]);
        normals.push(ndata[i][j]);

        points.push(data[i + 1][j + 1]);
        normals.push(ndata[i + 1][j + 1]);

        points.push(data[i][j + 1]);
        normals.push(ndata[i][j + 1]);
        index += 6;
      }
  }
}

function initializeWebGL(canvas) {
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
}

function drawScene() {

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

  var vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
  projectionMatrix = ortho(-4, 4, -4, 4, -200, 200);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

  var lightPosition = vec4(0.0, 0.0, 20.0, 0.0);
  var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
  var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

  var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
  var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
  var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
  var materialShininess = 10.0;

  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  var specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}

onload = function init() {
  msgAlert("Welcome", "Untuk mengubah kamera bisa dilakukan dengan <b>Arrow pada keyboard</b>, untuk menghentikan animasi ketuk tombol <b>Toogle Animation</b>", "info");
  canvas = document.getElementById("gl-canvas");
  perspectiveSettings = new PerspectiveSettings(canvas);
  initializeWebGL(canvas);
  initializeTeapot();
  drawScene();
  registerEventListeners();
  render();
};

// Menampilkan alert
function msgAlert(title, msg, icon) {
  Swal.fire({
    title: title,
    html: msg,
    icon: icon,
    confirmButtonText: 'Continue'
  })
}


function registerEventListeners() {
  document.getElementById("ButtonT").onclick = toggleAnimation;
  document.addEventListener('keydown', function (event) {
    var keyCodeToDirection = {
      37: {
        y: 0,
        x: -1
      }, //left
      38: {
        y: -1,
        x: 0
      }, //up
      39: {
        y: 0,
        x: 1
      }, //right
      40: {
        y: 1,
        x: 0
      }, //down
    };
    if (event.keyCode in keyCodeToDirection) {
      var direction = keyCodeToDirection[event.keyCode];
      var oldX = cameraController.x;
      var oldY = cameraController.y;
      var newX = oldX + direction.x;
      var newY = oldY + direction.y;

      // Handle tidak bisa pindah Horizontal
      if (oldY == 0 || oldY == 2) {
        if (newX < 0 || newX > 2) {
          newX = oldX;
          msgAlert("Tidak Bisa Ganti Dimensi Secara Horizontal di Pojok", "Untuk mengganti Z Horizontal selain di layer tengah silahkan ke titik Kanan Pusat atau Kiri Pusat", "error");
        }
      }


      // Handle tidak bisa pindah Vertikal jika dipojok
      if (oldX == 0 || oldX == 2) {
        if (newY < 0 || newY > 2) {
          newY = oldY;
          msgAlert("Tidak Bisa Ganti Dimensi Vertikal di Pojok", "Untuk mengganti Z Vertikal silahkan ke titik tengah atas, atau bawah", "error");
        }
      }

      // Layer Merah (Paling depan)
      // Berpindah secara vertikal
      if (cameraController.z == 1) {
        if (newY < 0 || newY > 2) {
          newY = oldY;
          msgAlert("Informasi:", "Untuk mengganti Z Vertikal Pada Layer Tengah bisa dilakukan di titik tengah atas dan tengah bawah. Arrow <b>Atas Akan ke Layer Biru (Belakang)</b> dan Arrow <b>Bawah ke Layer Merah (Depan)</b>", "info");
          cameraController.changeZ(false);
        }

        // Horizontal
        if (newX < 0 || newX > 2) {
          newX = oldX;
          msgAlert(
            "Informasi:", 
            "Untuk mengganti Z Pada Layer Tengah, Gunakan Pindahan <b> Z Vertikal (Tengah Atas dan Tengah Bawah).</b> Arrow <b>Atas </b> akan ke <b>Layer Biru (Belakang) </b> dan Arrow <b>Bawah</b> akan ke <b>Layer Merah (Depan)</b>", 
            "info");
          cameraController.changeZ(false);
        }
      }

      // Layer Hijau (Tengah)
      if (cameraController.z == 0) {
        // Saat Atas dan bawah pindah sesuai informasi dari alert 
        // Panah Atas(y--) akan ke layer biru Panah Bawah(y++) ke layer merah
        // Tengah Atas(1,0,0)
        if (oldX == 1) {
          if (oldY == 0) {
            // Handle Arrow Atas
            if (newY < 0) { // Ke Biru
              newY = oldY;
              cameraController.changeZ(false);
              msgAlert("Informasi:", 
              "Karena melihat perspektif perpindahan dari depan maka di layer biru perpindahan horizontal terasa <b>inverted</b>", 
              "warning");
            } else if (newY == 1) { // Ke Merah
              newY = 0;
              cameraController.changeZ(true);
            }
          }

          // Tengah Bawah(1,2,0)
          if (oldY == 2) {
            // Handle Arrow Atas
            if (newY == 1) { // Ke Merah
              newY = 2;
              cameraController.changeZ(false);
            } else if (newY > 2) { // Ke Biru
              newY = oldY;
              cameraController.changeZ(true);
              msgAlert("Informasi:", 
              "Karena melihat perspektif perpindahan dari depan maka di layer biru perpindahan horizontal terasa <b>inverted</b>", 
              "warning");
            }
          }
        }

        // Saat Horizontal tidak bisa di tengah, karena kalau bisa tidak bisa ke titik pusat hijau
        if (newX < 0 || newX > 2) {
          newX = oldX;
          msgAlert("Tidak Bisa Ganti Dimensi Secara Horizontal di Layer Tengah", "Untuk mengganti Z Pada Layer Tengah, Gunakan Pindahan Z <b>Vertikal</b> Arrow <b>Atas Akan ke Layer Biru </b> dan Arrow <b>Bawah ke Layer Merah</b>", "error");
        }
      }


      // Layer Biru 
      if (cameraController.z == -1) {
        // Vertikal
        if (newY < 0 || newY > 2) {
          newY = oldY;
          msgAlert("Informasi:", "Untuk mengganti Z Vertikal pada Layer Tengah, bisa dilakukan di titik tengah atas dan tengah bawah. Arrow <b>Atas Akan ke Layer Biru </b> dan Arrow <b>Bawah ke Layer Merah</b>", "info");
          cameraController.changeZ(false);
        }

        // Horizontal
        if (newX < 0 || newX > 2) {
          if (newX < 0) newX = 2;
          if (newX > 2) newX = 0;
          msgAlert(
            "Informasi:", 
            "Untuk mengganti Z Pada Layer Tengah, Gunakan Pindahan <b> Z Vertikal (Tengah Atas dan Tengah Bawah).</b> Arrow <b>Atas </b> akan ke <b>Layer Biru (Belakang) </b> dan Arrow <b>Bawah</b> akan ke <b>Layer Merah (Depan)</b>", 
            "info");
          cameraController.changeZ(false);
        }
      }

      // Label Naming Kamera X
      if (newX == 0) document.getElementById("camera-info").innerHTML = "Kiri";
      else if (newX == 1) document.getElementById("camera-info").innerHTML = "Tengah";
      else if (newX == 2) document.getElementById("camera-info").innerHTML = "Kanan";

      // Label Naming Kamera Y
      if (newY == 0) document.getElementById("camera-info").innerHTML += " - Atas";
      else if (newY == 1) document.getElementById("camera-info").innerHTML += " - Tengah";
      else if (newY == 2) document.getElementById("camera-info").innerHTML += " - Bawah";

      // Label Handling Layer (Z)
      if (cameraController.z == -1) document.getElementById("layer-info").innerHTML = "Biru (Belakang)";
      else if (cameraController.z == 0) document.getElementById("layer-info").innerHTML = "Hijau (Tengah)";
      else if (cameraController.z == 1) document.getElementById("layer-info").innerHTML = "Merah (Depan)";

      cameraController.x = newX;
      cameraController.y = newY;
    }
  });
}

function toggleAnimation() {
  animationController.toggleDisabled();
}

function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, displayWidth, displayHeight);
  }
}

function render() {
  resize(gl.canvas);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (!animationController.disabled) {
    animationController.forward();
  }

  modelViewMatrix = translate.apply(null, animationController.movementVector);

  // Adjust teapot position
  modelViewMatrix = mult(modelViewMatrix, translate(0, -1.5, 0))

  modelViewMatrix = mult(
    modelViewMatrix,
    lookAt(cameraController.eye, cameraController.at, cameraController.up)
  );

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  projectionMatrix = perspective(
    perspectiveSettings.fovy,
    perspectiveSettings.aspect,
    perspectiveSettings.near,
    perspectiveSettings.far
  );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  normalMatrix = [
    vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
    vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
    vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

  gl.drawArrays(gl.TRIANGLES, 0, index);

  requestAnimFrame(render);
}