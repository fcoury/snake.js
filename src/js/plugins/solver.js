import _ from '../../libs/lodash.js';

import { LEFT, RIGHT, UP, DOWN } from '../game';
import { MAX_X, MAX_Y } from '../game';
import Pixel from '../pixel';

const HIT = 'HIT';
const OOB = 'OOB';
const FOOD = 'FOOD';

class Move {
  constructor(snake, food, direction) {
    this.snake = snake;
    this.food = food;
    this.direction = direction;
    this.result = null;
  }

  isFood() {
    return this.result === FOOD;
  }

  isPosition() {
    return Pixel.prototype.isPrototypeOf(this.result);
  }

  execute() {
    const sx = this.snake.head().x;
    const sy = this.snake.head().y;
    const fx = this.food.x;
    const fy = this.food.y;

    let px = sx;
    let py = sy;

    switch (this.direction) {
      case LEFT:
        px -= 1;
        break;

      case RIGHT:
        px += 1;
        break;

      case UP:
        py -= 1;
        break;

      case DOWN:
        py += 1;
        break;
    }

    if (px < 1 || px > MAX_X || py < 1 || py > MAX_Y) {
      this.result = OOB;
      return;
    }

    if (px == fx && py == fy) {
      this.result = FOOD;
      return;
    }

    if (this.snake.contains(px, py)) {
      this.result = HIT;
      return;
    }

    this.result = new Pixel(px, py);
  }
}

export default class Solver {
  constructor(game) {
    this.game = game;
    this.snake = game.snake;
    this.food = game.food;
    this.moves = [];
  }

  suggestDirection(snake, food) {
    const sx = snake.head().x;
    const sy = snake.head().y;
    const fx = food.x;
    const fy = food.y;
    const dx = fx - sx;
    const dy = fy - sy;

    let sugDir = null;

    if (dx == 0) {
      if (dy > 0) {
        sugDir = DOWN;
      }
      else if (dy < 0) {
        sugDir = UP;
      }
    }
    else {
      if (dx > 0) {
        sugDir = RIGHT;
      }
      else {
        sugDir = LEFT;
      }
    }

    return sugDir;
  }

  calculateOutcome(snake, food) {
    console.log('calculateOutcome', snake, food);
    const direction = this.suggestDirection(snake, food);
    const move = new Move(snake, food, direction);
    move.execute();
    this.moves.push(move);
    console.log('Calculating outcome for ', snake.head(), '-', move.result);

    if (move.isPosition()) {
      const newSnake = _.cloneDeep(snake);
      newSnake.performMove(direction);
      return this.calculateOutcome(newSnake, food);
    }

    if (move.isFood()) {
      return true;
    }

    return false;
  }

  run() {
    console.log('game', this.game);
    const snake = _.cloneDeep(this.game.snake);
    const food = this.game.food;
    console.log('Starting for', snake, food);
    const outcome = this.calculateOutcome(snake, food);
    console.log('movement', this.moves[0].direction);
    this.game.snake.direction = this.moves[0].direction;
  }
}
