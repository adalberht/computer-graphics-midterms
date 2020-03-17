class Game {
  static INCREMENT_SCORE = 10.0;

  constructor(player, initialBall) {
    this.started = false;
    this.score = 0.0;
    this.gameOver = false;
    player =
      player ||
      new Player(
        [50.0, 50.0],
        [0.0, 1.0, 0.0, 1.0],
        canvas.width,
        canvas.height
      );
    initialBall = initialBall || new Ball([250.0, 250.0], [0.0, 0.0, 1.0, 1.0]);
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

  shouldTick() {
    return this.started && !this.gameOver;
  }

  spawnRandomBallOverTime() {
    var self = this;
    this.spawnRandomBallIntervalID = setInterval(function() {
      self.addBall(new Ball());
    }, 2000);
  }

  increaseScoreOverTime() {
    var self = this;
    this.updateScoreIntervalID = setInterval(function() {
      if (!self.gameOver) {
        self.score += Game.INCREMENT_SCORE;
      }
    }, 1000);
  }

  handleKeyPresses(keyPresses) {
    for (var keyCode in keyPresses) {
      if (keyPresses[keyCode]) {
        this.handleKeyPress(keyCode);
      }
    }
  }

  handleKeyPress(keyCode) {
    if (keyCode == 37) {
      // Left cursor key
      game.player.moveLeft();
    } else if (keyCode == 38) {
      // Up cursor key
      game.player.moveUp();
    } else if (keyCode == 39) {
      // Right cursor key
      game.player.moveRight();
    } else if (keyCode == 40) {
      // Down cursor key
      game.player.moveDown();
    }
  }

  checkCollision(onPlayerCollision) {
    for (var ball of this.balls) {
      let collisionOrientation = getCollisionOrientation(this.player, ball);
      if (collisionOrientation !== undefined) {
        console.log(collisionOrientation);
        onPlayerCollision();
      }
    }

    for (var i = 0; i < this.balls.length ; ++i) {
      const ball = this.balls[i];
      ball.checkBorderCollision();
      for (var j = i + 1; j < this.balls.length; ++j) {        
        ball.checkCollision(this.balls[j]);
      }
    }

    const newBalls = [];
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
    // for (var newBall of newBalls) {
    //   this.addBall(newBall);
    // }
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
