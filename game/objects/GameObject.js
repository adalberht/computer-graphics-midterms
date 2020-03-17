// Superclass dari Ball dan Player untuk mengkomposisi atribut-atribut dan behavior yang sama
class GameObject {
  constructor({
    startLocation,
    color,
    width,
    height,
    velocity,
    canvasWidth,
    canvasHeight
  }) {
    this.location = Object.create(startLocation);
    this.color = color;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.createGLBuffers();
  }

  createGLBuffers() {
    this.vertexBuffer = gl.createBuffer();
    this.vertexBuffer.itemSize = 2;
    this.vertexBuffer.numberOfItems = 4;
    this.colorBuffer = gl.createBuffer();
    this.colorBuffer.itemSize = 4;
    this.colorBuffer.numberOfItems = 1;
  }

  // Getter property untuk kepentingan drawing di WebGL
  get vertices() {
    // destructure operator available in ES5 JavaScript
    const { location, width, height } = this;
    const p1 = location;
    const p2 = add(location, vec2(0, height));
    const p3 = add(location, vec2(width, 0));
    const p4 = add(location, vec2(width, height));
    const vertex = [...p1, ...p2, ...p3, ...p4];
    return vertex;
  }

  // Fungsi ini dipanggil saat ada perubahan properties di canvas (untuk keperluan responsive)
  updateCanvasProperties(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  // Fungsi untuk melakukan perkalian kecepatan objek
  multiplyVelocity(multiplier) {
    if (typeof(this.velocity) === typeof([])) {
      this.velocity = mult(this.velocity, multiplier);
    } else {
      this.velocity *= multiplier;
    }
  }

  get colors() {
    return [...this.color, ...this.color, ...this.color, ...this.color];
  }

  moveUp() {
    this.location = add(this.location, vec2(0, -this.velocity));
    if (this.location[1] <= 0) {
      this.location[1] = 0;
      this.onTopBorderReached();
    }
  }

  moveRight() {
    this.location = add(this.location, vec2(this.velocity, 0));
    if (this.location[0] + this.width >= this.canvasWidth) {
      this.location[0] = this.canvasWidth - this.width;
      this.onRightBorderReached();
    }
  }

  moveDown() {
    this.location = add(this.location, vec2(0, this.velocity));
    if (this.location[1] + this.height >= this.canvasHeight) {
      this.location[1] = this.canvasHeight - this.height;
      this.onBottomBorderReached();
    }
  }

  moveLeft() {
    this.location = add(this.location, vec2(-this.velocity, 0));
    if (this.location[0] <= 0) {
      this.location[0] = 0;
      this.onLeftBorderReached();
    }
  }

  onTopBorderReached() {
    console.log("Player has reached top border");
  }

  onBottomBorderReached() {
    console.log("Player has reached bottom border");
  }

  onLeftBorderReached() {
    console.log("Player has reached left border");
  }

  onRightBorderReached() {
    console.log("Player has reached right border");
  }

  checkCollision(another) {
    var collisionOrientation = getCollisionOrientation(this, another);
    // Jika collide di horizontal
    if (collisionOrientation === "LEFT" || collisionOrientation === "RIGHT") {
      if (!(this instanceof Player)) this.multiplyVelocity([-1.0, 1.0]);
      another.multiplyVelocity([-1.0, 1.0]);
    }
    
    // Jika kena sisi atas dari player
    if (collisionOrientation === "TOP" || collisionOrientation === "BOTTOM") {
      if (!(this instanceof Player)) this.multiplyVelocity([1.0, -1.0]);
      another.multiplyVelocity([1.0, -1.0]);
    }
  }
}
