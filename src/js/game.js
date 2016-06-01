import Snake from './snake';
import Food from './food';

export const WIDTH = 480;
export const HEIGHT = 320;
export const PIXMUL = 16;
export const MAX_X = WIDTH / PIXMUL;
export const MAX_Y = HEIGHT / PIXMUL;
export const UP = 'UP';
export const RIGHT = 'RIGHT';
export const DOWN = 'DOWN';
export const LEFT = 'LEFT';
export const HIT = 'HIT';
export const OOB = 'OOB';
export const FOOD = 'FOOD';
export const DIRECTIONS = [UP, RIGHT, DOWN, LEFT];

export const CLR_BACKGROUND = '#666';
export const CLR_FRAME = 'black';
export const CLR_SNAKE = 'white';
export const CLR_FOOD = 'yellow';

export default class SnakeGame {
  ctx = null;
  plugins = [];

  constructor(canvas, banner) {
    this.banner = banner;
    this.ctx = canvas.getContext('2d');
  }

  reset() {
    this.rightPressed = false;
    this.leftPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.initialSize = 10;
    this.frameCnt = 0;
    this.frameLimit = 10;
    this.food = null;
    this.paused = false;
    this.snake = new Snake(this);
  }

  keyPressed(e) {
    if (e.keyCode == 39) {
      this.rightPressed = true;
    }
    if (e.keyCode == 37) {
      this.leftPressed = true;
    }
    if (e.keyCode == 38) {
      this.upPressed = true;
    }
    if (e.keyCode == 40) {
      this.downPressed = true;
    }
    if (e.keyCode == 80) {
      this.paused = !this.paused;
    }
  }

  drawBackground() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = CLR_BACKGROUND;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  handleMovement() {
    if (this.rightPressed) {
      this.snake.moveRight();
    }
    if (this.leftPressed) {
      this.snake.moveLeft();
    }
    if (this.upPressed) {
      this.snake.moveUp();
    }
    if (this.downPressed) {
      this.snake.moveDown();
    }
  }

  addFood() {
    if (!this.food) {
      this.snake.grow(2);
      this.food = new Food(this);
    }
  }

  draw() {
    this.food.draw();
    this.snake.draw();
  }

  checkFoodEaten() {
    if (this.food.eaten()) {
      this.food = null;
      this.snake.grow(2);
      this.frameLimit -= 0.5;
    }
  }

  drawBorder() {
    this.ctx.fillStyle = CLR_FRAME;
    this.ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }

  drawPixel(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * PIXMUL, y * PIXMUL, PIXMUL, PIXMUL);
  }

  checkAlive() {
    if (!this.snake.alive) {
      this.banner.innerHTML = 'GAME OVER - YOUR SCORE: ' + this.snake.score();
      return false;
    }

    return true;
  }

  handlePlugins() {
    for (var i = 0; i < this.plugins.length; i++) {
      this.plugins[i].trigger(this.snake, this.food);
    }
  }

  moveSnake() {
    if (this.frameCnt >= this.frameLimit) {
      this.handlePlugins();
      this.snake.move();
      this.frameCnt = 0;
    }
    this.frameCnt++;
  }

  updateScore() {
    let text = 'SCORE: ' + this.snake.score();
    if (this.paused) {
      text = "PAUSED. Press 'p' to resume."
    }
    this.banner.innerHTML = text;
  }

  tick() {
    if (!this.paused) {
      this.drawBackground();
      this.handleMovement();
      this.addFood();

      this.draw();
      this.checkFoodEaten();
      this.drawBorder();

      if (!this.checkAlive()) {
        return;
      }

      this.moveSnake();
    }
    this.updateScore();

    setTimeout(this.tick.bind(this), 10);
  }

  start() {
    this.reset();
    this.tick();
  }
}
