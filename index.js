(function() {
  'use strict';

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var debug = document.getElementById('debug');
  console.log('debug', debug);

  var map = [
    //....|....1....|....2....|....3....|....4
     'xxxxxxxxxxx                            ',
     'x          x                           ',
     'xxxxxxxxxxx                            ',
     'x          x                           ',
     'xxxxxxxxxxx                             ',
     '                                       ',
     '                                       ',
     '                                       ',
     '                                       ',
     '                                       ',
     '                                       ',
     '                                       ',
     '                                       ',
     '                                       ',
     '                                       '
  ];

  ctx.fillStyle = 'blue';

  var PIXMUL = 8;
  var UP = 0;
  var RIGHT = 1;
  var DOWN = 2;
  var LEFT = 3;
  var MAX_X = (480-PIXMUL) / PIXMUL;
  var MAX_Y = (320-PIXMUL) / PIXMUL;
  var rightPressed = false;
  var leftPressed = false;
  var upPressed = false;
  var downPressed = false;

  function drawPixel(x, y) {
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

  function keyUpHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    }
    if (e.keyCode == 37) {
      leftPressed = false;
    }
    if (e.keyCode == 38) {
      upPressed = false;
    }
    if (e.keyCode == 40) {
      downPressed = false;
    }
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function Snake() {
    this.size = 15;
    this.direction = DOWN;
    this.active = true;
    this.pixels = [[5, 1]];

    this.addPixel = function(x, y) {
      console.log('addPixel', x, y)
      this.pixels.push([x, y]);
    }

    this.grow = function() {
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
      console.log('move')
      this.pixels.shift();
      this.grow();
    }

    while (this.pixels.length < this.size) {
      this.grow();
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
        drawPixel(sx, sy);
      }
    }

  }

  var snake = new Snake();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    snake.draw();
    if (i === 10) {
      snake.move();
      i = 0;
    }
    i++;
    // snake.grow();
    debug.innerHTML = snake.textDir();
    setTimeout(draw, 10);
  }

  var i = 0;
  draw();

})()
