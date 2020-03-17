// Kelas yang dibutuhkan
// Kelas Player untuk pembuatan player
class Player extends GameObject {
  constructor(startLocation, color, canvasWidth, canvasHeight) {
    super({
      startLocation,
      color,
      width: 50,
      height: 50,
      velocity: 8.0,
      canvasWidth,
      canvasHeight
    });
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
}
