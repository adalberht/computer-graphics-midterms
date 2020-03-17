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

