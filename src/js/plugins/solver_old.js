// import _ from '../../libs/lodash.js';
//
// import { DIRECTIONS, LEFT, RIGHT, UP, DOWN } from '../game';
// import { MAX_X, MAX_Y } from '../game';
// import Pixel from '../pixel';
//
// const HIT = 'HIT';
// const OOB = 'OOB';
// const FOOD = 'FOOD';
//
// class Move {
//   constructor(snake, food, direction) {
//     this.snake = snake;
//     this.food = food;
//     this.direction = direction;
//     this.result = null;
//   }
//
//   isFood() {
//     return this.result === FOOD;
//   }
//
//   isPosition() {
//     return Pixel.prototype.isPrototypeOf(this.result);
//   }
//
//   execute() {
//     const sx = this.snake.head().x;
//     const sy = this.snake.head().y;
//     const fx = this.food.x;
//     const fy = this.food.y;
//
//     let px = sx;
//     let py = sy;
//
//     switch (this.direction) {
//       case LEFT:
//         px -= 1;
//         break;
//
//       case RIGHT:
//         px += 1;
//         break;
//
//       case UP:
//         py -= 1;
//         break;
//
//       case DOWN:
//         py += 1;
//         break;
//     }
//
//     if (px < 1 || px > MAX_X || py < 1 || py > MAX_Y) {
//       this.result = OOB;
//       return;
//     }
//
//     if (px == fx && py == fy) {
//       this.result = FOOD;
//       return;
//     }
//
//     if (this.snake.contains(px, py)) {
//       this.result = HIT;
//       return;
//     }
//
//     this.result = new Pixel(px, py);
//   }
// }
//
// export default class Solver {
//   constructor(game) {
//     this.game = game;
//     this.snake = game.snake;
//     this.food = game.food;
//     this.moves = [];
//   }
//
//   suggestDirection(snake, food) {
//     const sx = snake.head().x;
//     const sy = snake.head().y;
//     const fx = food.x;
//     const fy = food.y;
//     const dx = fx - sx;
//     const dy = fy - sy;
//
//     let sugDir = null;
//
//     if (dx == 0) {
//       if (dy > 0) {
//         sugDir = DOWN;
//       }
//       else if (dy < 0) {
//         sugDir = UP;
//       }
//     }
//     else {
//       if (dx > 0) {
//         sugDir = RIGHT;
//       }
//       else {
//         sugDir = LEFT;
//       }
//     }
//
//     return sugDir;
//   }
//
//   dump(snake, food) {
//     const lines = [];
//     for (let y = 0; y <= MAX_Y; y++) {
//       let line = '';
//       for (let x = 0; x <= MAX_X; x++) {
//         if (snake.head().x == x && snake.head().y == y) {
//           line += 'H';
//           continue;
//         }
//         if (snake.contains(x, y)) {
//           line += 'S';
//           continue;
//         }
//         if (food.x == x && food.y == y) {
//           line += 'F';
//           continue;
//         }
//         line += '.';
//       }
//       lines.push(line);
//     }
//     lines.forEach(l => console.log(l));
//   }
//
//   movePlan(snake, food, moves, directions, level) {
//     console.log(level, 'moves', moves.length, 'directions', directions);
//     level = level || 1;
//     let direction;
//     if (directions) {
//       if (directions.length < 1) {
//         return snake;
//       }
//       direction = directions.pop();
//     }
//     else {
//       directions = _.cloneDeep(DIRECTIONS);
//       direction = this.suggestDirection(snake, food);
//       _.pull(directions, direction);
//     }
//
//     const move = new Move(snake, food, direction);
//     move.execute();
//     // console.log('Calculating', direction, 'for', snake.head(), '-', move.result);
//     moves.push(move);
//
//     if (move.isPosition()) {
//       const newSnake = _.cloneDeep(snake);
//       newSnake.performMove(direction);
//       this.dump(newSnake, food);
//       return this.movePlan(newSnake, food, moves, null, level+1);
//     }
//
//     if (move.isFood()) {
//       return true;
//     }
//
//     moves.pop();
//     this.dump(snake, food);
//     return this.movePlan(snake, food, moves, directions, level);
//   }
//
//   calculateOutcome(snake, food, nextDirection, level) {
//     const direction = nextDirection || this.suggestDirection(snake, food);
//     const move = new Move(snake, food, direction);
//     level = (level || 1);
//
//     move.execute();
//     console.log('Calculating', direction, 'for', snake.head(), '-', move.result);
//     this.moves.push(move);
//
//     if (move.isPosition()) {
//       const newSnake = _.cloneDeep(snake);
//       newSnake.performMove(direction);
//       return this.calculateOutcome(newSnake, food, null, level+1);
//     }
//
//     if (move.isFood()) {
//       return true;
//     }
//
//     // undo last move
//     console.log('HIT found')
//     this.moves.pop();
//     let nextDir = DIRECTIONS.indexOf(direction) + 1;
//     if (nextDir > DIRECTIONS.length-1) {
//       nextDir = 0;
//     }
//     return this.calculateOutcome(snake, food, DIRECTIONS[nextDir], level+1);
//   }
//
//   run() {
//     const snake = _.cloneDeep(this.game.snake);
//     const food = this.game.food;
//     console.log('head', snake.head(), '- food x:', food.x, 'y:', food.y);
//     // const outcome = this.calculateOutcome(snake, food);
//     // this.game.snake.direction = this.moves[0].direction;
//     let moves = [];
//     while (true) {
//       const result = this.movePlan(snake, food, moves);
//       console.log('result', result);
//       if (result === true) {
//         break;
//       }
//       snake = result;
//       this.moves.pop();
//     }
//     // moves.forEach((m) => {
//     //   console.log('Move', m.direction, 'for', m.snake.head(), '-', m.result);
//     // });
//     this.game.snake.direction = moves[0].direction;
//   }
// }
