import Game from '../build/js/game';
import Food from '../build/js/food';
import Pixel from '../build/js/pixel';
import Solver from '../build/js/plugins/solver';
const expect = require('chai').expect;

describe('Something', () => {
  it('returns 1', () => {
    const canvas = { getContext: function() { return {}; } };
    const banner = {};
    const game = new Game(canvas, banner);
    game.reset();
    game.food = new Food(game);
    const food = game.food;
    food.x = 15;
    food.y = 1;

    const solver = new Solver(game);
    solver.run();
    expect(1).to.equal(2);
  });
});
