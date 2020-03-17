class Game {
  static INCREMENT_SCORE = 10.0;

  constructor(player, initialBall) {
    this.started = false;
    this.score = 0.0;
    this.gameOver = false;
    this.demo = false;
    player =
      player ||
      new Player(
        [50.0, 50.0],
        [0.0, 1.0, 0.0, 1.0],
        canvas.width,
        canvas.height
      );
    initialBall = initialBall || new Ball([250.0, 250.0], [1.0, 0.0, 0.0, 1.0]);
    this.player = player;
    this.balls = [initialBall];

  }

  addBall(ball) {
    this.balls.push(ball);
    initBuffers(ball);
  }

  start() {
    this.started = true;
    this.increaseScoreOverTime();
    this.spawnRandomBallOverTime();
  }

  end() {
    this.gameOver = true;
    clearInterval(this.updateScoreIntervalID);
    clearInterval(this.spawnRandomBallIntervalID);
  }

  startDemo() {
    this.start();
    this.demo = true;
    var self = this;
    this.demoIntervalID = setInterval(function () {
      if (self.player.velocity[0] === 0) self.player.velocity[0] = self.player.baseVelocity;
      if (self.player.velocity[1] === 0) self.player.velocity[1] = self.player.baseVelocity;
      const vx = Math.floor(Math.random() * 3) - 1; // random between [-1, 0, 1];
      const vy = Math.floor(Math.random() * 3) - 1; // random between [-1, 0, 1];
      self.player.multiplyVelocity([vx, vy]);
    }, 500);
  }

  endDemo() {
    this.demo = false;
    this.started = false;
    clearInterval(this.demoIntervalID);
  }

  shouldTick() {
    return this.started && !this.gameOver;
  }

  spawnRandomBallOverTime() {
    var self = this;
    this.spawnRandomBallIntervalID = setInterval(function () {
      // Randomizer spawn ball 0(kiri atas), 1 (kanan bawah), 2(kanan atas), 3(kiri atas)
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          // Default di ball kiri atas
          self.addBall(new Ball());
          break;
        case 1:
          // kiri bawah
          self.addBall(new Ball([0, canvas.height - 20], null, [1.0, 4.0]));
          break;
        case 2:
          // ball kanan atas
          self.addBall(new Ball([canvas.width - 20, 0 ], null, [-1.0, -4.0]));
          break;
        case 3:
          // Default di ball kanan bawah
          self.addBall(new Ball([canvas.width - 20, canvas.height - 20], null, [-1.0, 4.0]));
      }

    }, 2000);
  }

  increaseScoreOverTime() {
    var self = this;
    this.updateScoreIntervalID = setInterval(function () {
      if (!self.gameOver) {
        self.score += Game.INCREMENT_SCORE;
      }
    }, 1000);
  }

  handleKeyPresses(keyPresses) {
    if (this.demo) return;
    for (var keyCode in keyPresses) {
      if (keyPresses[keyCode]) {
        this.handleKeyPress(keyCode);
      }
    }
  }

  handleKeyPress(keyCode) {
    const {
      player
    } = this;
    if (keyCode == 37) {
      // Left cursor key
      player.moveLeft();
    } else if (keyCode == 38) {
      // Up cursor key
      player.moveUp();
    } else if (keyCode == 39) {
      // Right cursor key
      player.moveRight();
    } else if (keyCode == 40) {
      // Down cursor key
      player.moveDown();
    }
    player.normalize();
  }

  checkCollision(onPlayerCollision) {
    for (var ball of this.balls) {
      let collisionOrientation = getCollisionOrientation(this.player, ball);
      if (collisionOrientation !== undefined) {
        console.log(collisionOrientation);
        onPlayerCollision();
      }
    }

    for (var i = 0; i < this.balls.length; ++i) {
      const ball = this.balls[i];
      ball.checkBorderCollision();
      for (var j = i + 1; j < this.balls.length; ++j) {
        ball.checkCollision(this.balls[j]);
      }
    }

    for (var ball of this.balls) {
      const result = ball.checkBorderCollision();
      if (result !== WallCollisionResultEnum.none) {
        if (result === WallCollisionResultEnum.vertical) {
          ball.onVerticalBorderCollision();
        } else if (result === WallCollisionResultEnum.horizontal) {
          ball.onHorizontalBorderCollision();
        }
      }
    }
  }

  randomizePlayerMovement() {
    if (!this.demo) return;
    var player = this.player;
    player.location = add(player.location, player.velocity);
    player.normalize();
  }

  animateObjects() {
    if (!this.shouldTick) return;
    for (var ball of this.balls) {
      ball.move();
    }
  }

  get objects() {
    return [this.player, ...this.balls];
  }
}