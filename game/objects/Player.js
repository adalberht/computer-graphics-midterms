// Kelas yang dibutuhkan
// Kelas Player untuk pembuatan player
class Player extends GameObject {
  constructor(startLocation, color, canvasWidth, canvasHeight) {
    var baseVelocity = 8.0;
    super({
      startLocation,
      color,
      width: 50,
      height: 50,
      velocity: [baseVelocity, baseVelocity],
      canvasWidth,
      canvasHeight
    });
    this.baseVelocity = baseVelocity;
  }

  normalize() {
    // Check top border
    if (this.location[1] <= 0) {
      this.location[1] = 0;
      this.onTopBorderReached();
    }
    if (this.location[0] + this.width >= this.canvasWidth) {
      this.location[0] = this.canvasWidth - this.width;
      this.onRightBorderReached();
    }
    if (this.location[1] + this.height >= this.canvasHeight) {
      this.location[1] = this.canvasHeight - this.height;
      this.onBottomBorderReached();
    }
    if (this.location[0] <= 0) {
      this.location[0] = 0;
      this.onLeftBorderReached();
    }
  }

  moveUp() {
    this.location = add(this.location, vec2(0, -this.baseVelocity));
  }

  moveRight() {
    this.location = add(this.location, vec2(this.baseVelocity, 0));
  }

  moveDown() {
    this.location = add(this.location, vec2(0, this.baseVelocity));
  }

  moveLeft() {
    this.location = add(this.location, vec2(-this.baseVelocity, 0));
    
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
}
