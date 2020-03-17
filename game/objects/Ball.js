const WallCollisionResultEnum = Object.freeze({
  none: 0,
  vertical: 1,
  horizontal: 2,
});

// Kelas Bola untuk handle pembuatan bola
class Ball extends GameObject {
  constructor(startLocation, color, velocity) {
    color = color || [1.0, 0.0, 0.0, 1.0];
    startLocation = startLocation || [0, 0];
    velocity = velocity || [1.0, -4.0];
    const width = 20;
    const height = 20;
    super({ startLocation, color, width, height, velocity });
  }

  move() {
    this.location = add(this.location, this.velocity);
  }

  onVerticalBorderCollision() {
    this.multiplyVelocity([1.0, -1.0]);
    this.multiplyVelocity([1.01, 1.01]);
  }

  onHorizontalBorderCollision() {
    this.multiplyVelocity([-1.0, 1.0]);
    this.multiplyVelocity([1.01, 1.01]);
  }

  checkBorderCollision() {
    // Bola Kena Border Atas/Bawah
    if (
      this.location[1] - this.height / 2.0 < 0.0 ||
      this.location[1] + this.height / 2.0 >= canvas.height
    ) {
      return WallCollisionResultEnum.vertical;
    }
    // Bola Kena Border Kanan/kiri
    if (
      this.location[0] - this.width / 2.0 < 0.0 ||
      this.location[0] + this.width / 2.0 >= canvas.width
    ) {
      return WallCollisionResultEnum.horizontal;
    }
    return WallCollisionResultEnum.none;
  }

  clone() {
    return new Ball(
      this.location,
      this.color,
      this.velocity,
    );
  }
}
