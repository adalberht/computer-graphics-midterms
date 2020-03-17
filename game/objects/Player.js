// Kelas Player untuk pembuatan player objek di dalam game
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

  // Fungsi untuk mencegah Player keluar dari canvas
  preventOutOfBound() {
    // Check top border
    if (this.location[1] <= 0) {
      this.location[1] = 0;
    }
    if (this.location[0] + this.width >= this.canvasWidth) {
      this.location[0] = this.canvasWidth - this.width;
    }
    if (this.location[1] + this.height >= this.canvasHeight) {
      this.location[1] = this.canvasHeight - this.height;
    }
    if (this.location[0] <= 0) {
      this.location[0] = 0;
    }
  }

  // Fungsi yang dipanggil saat User menekan arrow up
  moveUp() {
    this.location = add(this.location, vec2(0, -this.baseVelocity));
  }

  // Fungsi yang dipanggil saat User menekan arrow kanan
  moveRight() {
    this.location = add(this.location, vec2(this.baseVelocity, 0));
  }

  // Fungsi yang dipanggil saat User menekan arrow bawah
  moveDown() {
    this.location = add(this.location, vec2(0, this.baseVelocity));
  }

  // Fungsi yang dipanggil saat User menekan arrow kiri
  moveLeft() {
    this.location = add(this.location, vec2(-this.baseVelocity, 0));
    
  }
}
