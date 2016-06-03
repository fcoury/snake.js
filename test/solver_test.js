import Game from '../build/js/game';
import Snake from '../build/js/snake';
import Food from '../build/js/food';
import Pixel from '../build/js/pixel';
import Solver from '../build/js/plugins/solver';
import { LEFT, RIGHT, UP, DOWN } from '../build/js/game';

const _ = require('lodash');
const expect = require('chai').expect;

describe('determining next move', () => {
  function makePixels(...points) {
    const pixels = [];
    for (let i = 0; i < points.length; i += 2) {
      pixels.push(new Pixel(points[i], points[i+1]));
    }
    return pixels;
  }

  function setupGame(game, gameString) {
    const snake = game.snake;
    const food = game.food;

    snake.pixels = [];

    let head;
    let tail;

    _.forEach(gameString.split('\n'), (line, y) => {
      if (line.indexOf('.') > -1) {
        line = line.trim();
        console.log('line', line);
        for (let x = 0; x < line.length; x++) {
          const c = line[x];
          switch (c) {
            case 'S':
              snake.pixels.push(new Pixel(x, y-1));
              break;

            case 'F':
              food.x = x;
              food.y = y-1;
              break;

            case 'H':
              head = new Pixel(x, y-1);
              break;

            case 'T':
              tail = new Pixel(x, y-1);
              break;
          }
        }
      }
    });

    snake.pixels.unshift(tail);
    snake.pixels.push(head);
  }

  const canvas = { getContext: function() { return {}; } };
  const banner = {};

  let game;
  let snake;
  let food;

  beforeEach(() => {
    game = new Game(canvas, banner);
    snake = new Snake(game);

    game.reset();
    game.food = new Food(game);
    game.snake = snake;

    food = game.food;
  });

  it('long snake', () => {
    setupGame(game, `
      ..............................
      .T......................F.....
      .S............................
      .S............................
      .S.HS.........................
      .S..S.........................
      .S..S.........................
      .S..S.........................
      .SSSS.........................
      ..............................
      ..............................
      ..............................
      ..............................
      ..............................
      ..............................
      ..............................
      ..............................
      ..............................
      ..............................
      ..............................
    `);

    const solver = new Solver(game);
    solver.run();

    expect(game.snake.direction).to.equal(DOWN);
  });


  it('snake at 5,5 and food at 15,1 moves to the right', () => {
    //....|....1....|....2....|....3
    setupGame(game, `
      ...............................
      ...............................
      ...............................
      .................SSSSSSSSS.....
      .................S.......S.....
      .................S.......S.....
      .................S.......T.....
      .................S.............
      .................S.............
      .................S.............
      .................S.............
      .................S.............
      .................S.............
      .F...............S.............
      .H...............S.............
      .SSSSSSSSSSSSSSSSS.............
      ...............................
      ...............................
      ...............................
      ...............................
      ...............................
    `);

    const solver = new Solver(game);
    solver.tick();

    expect(game.snake.direction).to.equal(RIGHT);
  });
});
