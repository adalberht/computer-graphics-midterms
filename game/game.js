class Game {
  static INCREMENT_SCORE = 10.0;

  constructor(player, initialBall) {
    this.started = false;
    this.score = 0.0;
    this.gameOver = false;
    this.player = player || new Player(
      [50.0, 50.0],
      [0.0, 1.0, 0.0, 1.0],
      canvas.width,
      canvas.height
    );
    initialBall = initialBall || new Ball(
      [250.0, 250.0], [0.0, 0.0, 1.0, 1.0]
    );
    this.balls = [initialBall];
  }

  setPlayer(player) {
    this.player = player;
  }

  addBall(ball) {
    this.balls.push(ball);
  }

  start() {
    this.started = true;
    this.increaseScoreOverTime();
  }

  end() {
    this.gameOver = true;
    // clearInterval(this.updateScoreIntervalID);
  }

  increaseScoreOverTime() {
    var self = this;
    this.updateScoreIntervalID = setInterval(function() {
      if (!self.gameOver) {
        self.score += Game.INCREMENT_SCORE;
      }
    }, 1000);
  }
}

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

  increaseVelocity(multiplier) {
    if (this.velocity instanceof []) {
      vec3.multiply(this.velocity, multiplier);
    } else {
      this.velocity *= multiplier;
    }
  }
}

// Kelas yang dibutuhkan
// Kelas Player untuk pembuatan player
class Player extends GameObject {
  constructor(startLocation, color, canvasWidth, canvasHeight) {
    super({ startLocation, color, width: 50, height: 50, velocity: 8.0, canvasWidth, canvasHeight });
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

  onTopBorderReached() { console.log("Player has reached top border"); }

  onBottomBorderReached() { console.log("Player has reached bottom border"); }

  onLeftBorderReached() { console.log("Player has reached left border"); }

  onRightBorderReached() { console.log("Player has reached right border"); }
}

// Kelas Bola untuk handle pembuatan bola
class Ball extends GameObject {
  constructor(startLocation, color, resolution) {
    const velocity = [-1.0, -1.0, 0.0];
    const width = 20;
    const height = 20;
    super({ startLocation, color, width, height, velocity });
    this.mvMatrix = mat4.create();
    mat4.identity(this.mvMatrix);
    mat4.translate(
      this.mvMatrix,
      normalToClip(Object.create(startLocation), resolution)
    );
  }
}
