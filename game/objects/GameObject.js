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
  }

  get vertices() {
    const { location, width, height } = this;
    const p1 = location;
    const p2 = add(location, vec2(0, height));
    const p3 = add(location, vec2(width, 0));
    const p4 = add(location, vec2(width, height));
    const vertex = [...p1, ...p2, ...p3, ...p4];
    return vertex;
  }

  updateCanvasProperties(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  multiplyVelocity(multiplier) {
    if (typeof(this.velocity) === typeof([])) {
      this.velocity = mult(this.velocity, multiplier);
    } else {
      this.velocity *= multiplier;
    }
  }
}
