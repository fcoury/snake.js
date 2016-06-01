
'use strict';

var plugins = [];
var canvas = document.getElementById('canvas');
var debug = document.getElementById('debug');
var btn = document.getElementById('button');
var pluginToggle = document.getElementById('pluginToggle');
console.log('pluginToggle', pluginToggle);

var ctx = canvas.getContext('2d');

var PIXMUL = 16;
var UP = 0;
var RIGHT = 1;
var DOWN = 2;
var LEFT = 3;
var MAX_X = (480) / PIXMUL;
var MAX_Y = (320) / PIXMUL;

var CLR_BACKGROUND = '#666';
var CLR_FRAME = 'black';
var CLR_SNAKE = 'white';
var CLR_FOOD = 'yellow';

var rightPressed;
var leftPressed;
var upPressed;
var downPressed;
var initialSize;
var frameCnt;
var frameLimit;
var snake;
var food;

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PIXMUL, y * PIXMUL, PIXMUL, PIXMUL);
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  }
  if (e.keyCode == 37) {
    leftPressed = true;
  }
  if (e.keyCode == 38) {
    upPressed = true;
  }
  if (e.keyCode == 40) {
    downPressed = true;
  }
}

document.addEventListener("keydown", keyDownHandler, false);

function getRandomInt(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Food(snake) {
  while (true) {
    if (!snake.alive) {
      break;
    }

    this.x = getRandomInt(1, MAX_X - 1);
    this.y = getRandomInt(1, MAX_Y - 1);

    if (!snake.contains(this.x, this.y)) {
      break;
    }
  }

  this.draw = function() {
    drawPixel(this.x, this.y, CLR_FOOD);
  }

  this.eaten = function() {
    return snake.contains(this.x, this.y);
  }
}

function Snake() {
  this.direction = getRandomInt(1, 2);
  this.active = true;
  this.pixels = [[5, 1]];
  this.alive = true;
  this.growBy = 0;

  this.head = function() {
    return this.pixels[this.pixels.length-1];
  }

  this.score = function() {
    return (this.pixels.length - initialSize);
  }

  this.textDir = function() {
    if (this.direction === UP) {
      return 'UP';
    }
    if (this.direction === RIGHT) {
      return 'RIGHT';
    }
    if (this.direction === DOWN) {
      return 'DOWN';
    }
    if (this.direction === LEFT) {
      return 'LEFT';
    }
  }

  this.contains = function(x, y) {
    for (var i = 0; i < this.pixels.length; i++) {
      var pix = this.pixels[i];
      if (pix[0] == x && pix[1] == y) {
        return true;
      }
    }

    return false;
  }

  this.grow = function(by) {
    this.growBy = by;
  }

  this.addPixel = function(x, y) {
    if (x < 0 || y < 0 || x >= MAX_X || y >= MAX_Y) {
      this.alive = false;
      return;
    }
    if (this.contains(x, y)) {
      this.alive = false;
      return;
    }
    this.pixels.push([x, y]);
  }

  this.addNewPixel = function() {
    var lastPixel = this.head();
    var x = lastPixel[0];
    var y = lastPixel[1];

    if (this.direction === RIGHT) {
      this.addPixel(x + 1, y);
    }
    if (this.direction === DOWN) {
      this.addPixel(x, y + 1);
    }
    if (this.direction === UP) {
      this.addPixel(x, y - 1);
    }
    if (this.direction === LEFT) {
      this.addPixel(x - 1, y);
    }
  }

  this.move = function() {
    this.addNewPixel();
    if (this.alive) {
      if (this.growBy > 0) {
        this.growBy -= 1;
        return;
      }

      this.pixels.shift();
    }
  }

  while (this.pixels.length < initialSize) {
    this.addNewPixel();
  }

  this.hit = function() {
    this.active = false;
  }

  this.moveRight = function() {
    this.direction = RIGHT;
    rightPressed = false;
  }

  this.moveLeft = function() {
    this.direction = LEFT;
    leftPressed = false;
  }

  this.moveUp = function() {
    this.direction = UP;
    upPressed = false;
  }

  this.moveDown = function() {
    if (this.direction == UP) {
      return;
    }
    this.direction = DOWN;
    downPressed = false;
  }

  this.draw = function() {
    for (var i = 0; i < this.pixels.length; i++) {
      var sx = this.pixels[i][0];
      var sy = this.pixels[i][1];
      drawPixel(sx, sy, CLR_SNAKE);
    }
  }

}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = CLR_BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (rightPressed) {
    snake.moveRight();
  }
  if (leftPressed) {
    snake.moveLeft();
  }
  if (upPressed) {
    snake.moveUp();
  }
  if (downPressed) {
    snake.moveDown();
  }

  if (!food) {
    snake.grow(2);
    food = new Food(snake);
  }

  food.draw();
  snake.draw();

  if (food.eaten()) {
    food = undefined;
    snake.grow(2);
    frameLimit -= 0.5;
  }

  ctx.fillStyle = CLR_FRAME;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  if (!snake.alive) {
    debug.innerHTML = 'GAME OVER - YOUR SCORE: ' + snake.score();
    return;
  }

  if (frameCnt >= frameLimit) {
    for (var i = 0; i < plugins.length; i++) {
      plugins[i].trigger(snake, food);
    }

    snake.move();
    frameCnt = 0;
  }
  frameCnt++;
  debug.innerHTML = 'SCORE: ' + snake.score();

  setTimeout(draw, 10);
}

function startGame() {
  rightPressed = false;
  leftPressed = false;
  upPressed = false;
  downPressed = false;
  initialSize = 10;
  frameCnt = 0;
  frameLimit = 10;
  food = null;
  plugins = [];

  if (pluginToggle.checked) {
    plugins.push(new AutoplayPlugin());
  }

  snake = new Snake();
  draw();
}

var AutoplayPlugin = function() {
  function outcome(snake, food, x, y) {

  }

  this.trigger = function(snake, food) {
    if (!food) {
      return;
    }

    var projDir = DOWN;
    var head = snake.head();
    var sx = head[0];
    var sy = head[1];
    var dir = snake.direction;

    var fx = food.x;
    var fy = food.y;

    var dx = sx - fx;
    var dy = sy - fy;

    if (dx == 0) {
      if (dy > 0) {
        projDir = UP;
      }
      else {
        projDir = DOWN;
      }
    }
    else if (dy == 0) {
      if (dx > 0) {
        projDir = LEFT;
      }
      else {
        projDir = RIGHT;
      }
    }
    else {
      if (dx > 0) {
        projDir = LEFT;
      }
      else {
        projDir = RIGHT;
      }
    }

    var attempts = 0;
    while (true) {
      attempts++;

      if (attempts > 100) {
        break;
      }

      if (!snake.alive) {
        break;
      }

      var px = sx;
      var py = sy;

      if (projDir == DOWN) {
        py += 1;
      }

      if (projDir == UP) {
        py -= 1;
      }

      if (projDir == RIGHT) {
        px += 1;
      }

      if (projDir == LEFT) {
        px -= 1;
      }

      console.log('px', px, 'py', py, 'contains', snake.contains(px, py),
        'alive', snake.alive, 'attempts', attempts);
      if (!snake.contains(px, py)) {
        break;
      }

      projDir++;
      if (projDir > 3) {
        projDir = 0;
      }
    }

    snake.direction = projDir;
  }
};

btn.onclick = startGame;
startGame();
