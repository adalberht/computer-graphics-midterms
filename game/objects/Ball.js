// Kelas Bola untuk handle pembuatan bola
class Ball extends GameObject {
  constructor(startLocation, color, resolution) {
    const velocity = [-1.0, -1.0, 0.0];
    const width = 20;
    const height = 20;
    super({ startLocation, color, width, height, velocity });
  }
}
