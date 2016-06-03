import _ from '../../libs/lodash.js';

import { DIRECTIONS, LEFT, RIGHT, UP, DOWN } from '../game';
import { MAX_X, MAX_Y } from '../game';

function dump(snake, food) {
  const lines = [];
  for (let y = 0; y <= MAX_Y; y++) {
    let line = '';
    for (let x = 0; x <= MAX_X; x++) {
      if (snake.head().x == x && snake.head().y == y) {
        line += 'H';
        continue;
      }
      if (snake.contains(x, y)) {
        line += 'S';
        continue;
      }
      if (food.x == x && food.y == y) {
        line += 'F';
        continue;
      }
      line += '.';
    }
    lines.push(line);
  }
  lines.forEach((l, i) => console.log(i, l));
}

function suggestDirection(snake, food) {
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

let cnt = 0;

class Move {
  constructor(parent, snake, food) {
    this.parent = parent;
    this.snake = snake;
    this.food = food;

    this.direction = null;
    this.child = null;
  }

  execute(level) {
    if (this.banner) {
      this.banner.innerHTML = `Executing: ${cnt++}`;
    }

    level = level || 1;

    const suggestedDir = suggestDirection(this.snake, this.food);
    const directions = _.cloneDeep(DIRECTIONS);

    let success = false;

    _.pull(directions, suggestedDir);
    directions.unshift(suggestedDir);

    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      const snake = _.cloneDeep(this.snake);
      snake.direction = dir;
      snake.move();

      if (snake.alive) {
        const eaten = this.food.eatenBy(snake);
        this.direction = dir;
        if (eaten) {
          console.log('food', this.food.x, this.food.y);
          console.log('snake', snake.head().x, snake.head().y);
          return true;
        }

        const move = new Move(this, snake, this.food);
        this.child = move;

        if (this.child.execute(level + 1)) {
          return true;
        }
      }
    }

    return false;
  }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

export default class Solver {
  constructor(game) {
    this.game = game;
  }

  initialize() {
    this.moves = [];
    this.snake = this.game.snake;
    this.food = this.game.food;

    const move = new Move(null, this.snake, this.food, null);
    move.banner = this.banner;
    move.execute();

    let m = move;
    let i = 0;
    console.log('plan:');
    while (true) {
      i += 1;
      console.log(i, m.direction)
      this.moves.push(m);
      if (!m.child) {
        break;
      }
      m = m.child;
    }
  }

  newFood() {
    this.initialize();
    console.log('food at', this.food.x, this.food.y)
    const lastMove = this.moves[this.moves.length-1];
    console.log('start:')
    dump(this.moves[0].snake, this.moves[0].food);
    console.log('final:')
    dump(lastMove.snake, lastMove.food);
    // sleep(2000);
  }

  tick() {
    if (!this.snake && this.game.snake) {
      this.initialize();
    }

    const move = this.moves.shift();
    console.log('move', move);
    if (move && move.direction) {
      this.game.snake.direction = move.direction;
    }
  }
}
