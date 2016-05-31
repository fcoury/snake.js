(function() {
  'use strict';

  var canvas = document.getElementById('canvas');
  var debug = document.getElementById('debug');
  var btn = document.getElementById('button');

  var ctx = canvas.getContext('2d');

  var PIXMUL = 8;
  var UP = 0;
  var RIGHT = 1;
  var DOWN = 2;
  var LEFT = 3;
  var MAX_X = (480) / PIXMUL;
  var MAX_Y = (320) / PIXMUL;
  var rightPressed = false;
  var leftPressed = false;
  var upPressed = false;
  var downPressed = false;
  var initialSize = 10;
  var frameCnt = 0;
  var frameLimit = 10;
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
      this.x = getRandomInt(1, MAX_X - 1);
      this.y = getRandomInt(1, MAX_Y - 1);

      if (!snake.contains(this.x, this.y)) {
        break;
      }
    }

    this.draw = function() {
      drawPixel(this.x, this.y, 'black');
    }

    this.eaten = function() {
      return snake.contains(this.x, this.y);
    }
  }

  function Snake() {
    this.direction = DOWN;
    this.active = true;
    this.pixels = [[5, 1]];
    this.alive = true;
    this.growBy = 0;

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
      var lastPixel = this.pixels[this.pixels.length - 1];
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
      this.direction = DOWN;
      downPressed = false;
    }

    this.draw = function() {
      for (var i = 0; i < this.pixels.length; i++) {
        var sx = this.pixels[i][0];
        var sy = this.pixels[i][1];
        drawPixel(sx, sy, 'green');
      }
    }

  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

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

    if (!snake.alive) {
      debug.innerHTML = 'GAME OVER';
      return;
    }

    if (frameCnt >= frameLimit) {
      snake.move();
      frameCnt = 0;
    }
    frameCnt++;
    debug.innerHTML = snake.textDir() + ' / ' + snake.pixels.length;
    setTimeout(draw, 10);
  }

  function startGame() {
    snake = new Snake();
    draw();
  }

  btn.onclick = startGame;

  startGame();

})()
