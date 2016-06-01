import Pixel from './pixel';
import { DIRECTIONS, LEFT, RIGHT, UP, DOWN } from './game';
import { CLR_SNAKE, MAX_X, MAX_Y } from './game';
import { getRandomInt } from './utils';

export const INITIAL_SIZE = 5;

function pix(x, y) {
  return new Pixel(x, y);
}

export default class Snake {
  constructor(game) {
    this.direction = DIRECTIONS[getRandomInt(1, 2)];
    this.active = true;
    this.pixels = [pix(5, 1)];
    this.alive = true;
    this.growBy = 0;
    this.game = game;

    while (this.pixels.length < INITIAL_SIZE) {
      this.addNewPixel();
    }
  }

  head() {
    return this.pixels[this.pixels.length-1];
  }

  score() {
    return (this.pixels.length - INITIAL_SIZE);
  }

  contains(x, y) {
    for (var i = 0; i < this.pixels.length; i++) {
      var pix = this.pixels[i];
      if (pix.x == x && pix.y == y) {
        return true;
      }
    }

    return false;
  }

  grow(by) {
    this.growBy = by;
  }

  addPixel(x, y) {
    if (x < 0 || y < 0 || x >= MAX_X || y >= MAX_Y) {
      this.alive = false;
      return;
    }
    if (this.contains(x, y)) {
      this.alive = false;
      return;
    }
    this.pixels.push(pix(x, y));
  }

  addNewPixel() {
    var lastPixel = this.head();
    var x = lastPixel.x;
    var y = lastPixel.y;

    if (this.direction === RIGHT) {
      this.addPixel(x + 1, y);
    }
    else if (this.direction === DOWN) {
      this.addPixel(x, y + 1);
    }
    else if (this.direction === UP) {
      this.addPixel(x, y - 1);
    }
    else if (this.direction === LEFT) {
      this.addPixel(x - 1, y);
    }
    else {
      throw `Unknown direction: ${this.direction}`;
    }
  }

  move() {
    this.addNewPixel();
    if (this.alive) {
      if (this.growBy > 0) {
        this.growBy -= 1;
        return;
      }

      this.pixels.shift();
    }
  }

  hit() {
    this.active = false;
  }

  moveRight() {
    if (this.direction != LEFT) {
      this.direction = RIGHT;
    }
    this.game.rightPressed = false;
  }

  moveLeft() {
    if (this.direction != RIGHT) {
      this.direction = LEFT;
    }
    this.game.leftPressed = false;
  }

  moveUp() {
    if (this.direction != DOWN) {
      this.direction = UP;
    }
    this.game.upPressed = false;
  }

  moveDown() {
    if (this.direction != UP) {
      this.direction = DOWN;
    }
    this.game.downPressed = false;
  }

  draw() {
    for (var i = 0; i < this.pixels.length; i++) {
      var sx = this.pixels[i].x;
      var sy = this.pixels[i].y;
      this.game.drawPixel(sx, sy, CLR_SNAKE);
    }
  }
}
