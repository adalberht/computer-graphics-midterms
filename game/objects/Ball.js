// Kelas Bola untuk handle pembuatan bola
class Ball extends GameObject {
  constructor(startLocation, color, velocity) {
    velocity = velocity || [-1.0, -1.0];
    const width = 20;
    const height = 20;
    super({ startLocation, color, width, height, velocity });
  }
}
