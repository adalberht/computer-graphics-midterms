/**
 * Resize a canvas to match the size its displayed.
 * @param {HTMLCanvasElement} canvas The canvas to resize.
 * @param {number} [multiplier] amount to multiply by.
 *    Pass in window.devicePixelRatio for native pixels.
 * @return {boolean} true if the canvas was resized.
 */
function resizeCanvasToDisplaySize(canvas, onCanvasSizeChanged) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    onCanvasSizeChanged();
  }
}

// Mengambil bounding dari object
function getBoundingBox(object) {
  let minX, minY, maxX, maxY;
  let width = object.width;
  let height = object.height;
  let originX = object.location[0];
  let originY = object.location[1];

  minX = originX;
  maxX = originX + width;
  minY = originY;
  maxY = originY + height;

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
  return (collidesHorizontally && collidesVertically);
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
