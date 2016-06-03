import SnakeGame from './game';
import Solver from './plugins/solver';

const canvas = document.getElementById('canvas');
const banner = document.getElementById('banner');
const btn = document.getElementById('button');
const game = new SnakeGame(canvas, banner);
game.registerPlugin(Solver);

const solver = document.getElementById('solver');
game.getPlugins()[0].banner = solver;

document.addEventListener('keydown', game.keyPressed.bind(game), false);

btn.onclick = game.start.bind(game);
game.start();
