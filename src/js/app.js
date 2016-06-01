import SnakeGame from './game';

const canvas = document.getElementById('canvas');
const banner = document.getElementById('banner');
const btn = document.getElementById('button');
const game = new SnakeGame(canvas, banner);

document.addEventListener('keydown', game.keyPressed.bind(game), false);

btn.onclick = game.start;
game.start();