import { getRandomInt } from './utils';
import { CLR_FOOD, MAX_X, MAX_Y, drawPixel } from './game';

export default class Food {
  constructor(game) {
    this.game = game;
    this.snake = game.snake;
    this.setPosition();
  }

  setPosition() {
    while (true) {
      if (!this.snake.alive) {
        break;
      }

      this.x = getRandomInt(1, MAX_X - 1);
      this.y = getRandomInt(1, MAX_Y - 1);

      if (!this.snake.contains(this.x, this.y)) {
        break;
      }
    }
  }

  draw() {
    this.game.drawPixel(this.x, this.y, CLR_FOOD);
  }

  eaten() {
    return this.snake.contains(this.x, this.y);
  }
}
