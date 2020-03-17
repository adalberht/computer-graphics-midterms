const WallCollisionResultEnum = Object.freeze({
  none: 0,
  vertical: 1,
  horizontal: 2,
});

// Kelas Bola untuk handle pembuatan bola
class Ball extends GameObject {
  constructor(startLocation, color, velocity) {
    velocity = velocity || [-1.0, -1.0];
    const width = 20;
    const height = 20;
    super({ startLocation, color, width, height, velocity });
  }

  move() {
    this.location = add(this.location, this.velocity);
  }

  onVerticalBorderCollision() {
    this.multiplyVelocity([1.0, -1.0]);
    return WallCollisionResultEnum.vertical;
  }

  onHorizontalBorderCollision() {
    this.multiplyVelocity([-1.0, 1.0]);
    return WallCollisionResultEnum.horizontal;
  }

  checkForWallCollision() {
    // Bola Kena Border Atas/Bawah
    if (
      this.location[1] - this.height / 2.0 < 0.0 ||
      this.location[1] + this.height / 2.0 >= canvas.height
    ) {
      return this.onVerticalBorderCollision();
    }
    // Bola Kena Border Kanan/kiri
    if (
      this.location[0] - this.width / 2.0 < 0.0 ||
      this.location[0] + this.width / 2.0 >= canvas.width
    ) {
      return this.onHorizontalBorderCollision();
    }
    return WallCollisionResultEnum.none;
  }

  cloneWith({ location, color, width, height, velocity }) {
    return new Ball({
      startLocation: location || this.location,
      color: color || this.color,
      width: width || this.width,
      height: height || this.height,
      velocity: velocity || this.velocity
    });
  }
}
