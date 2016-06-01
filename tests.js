var PIXMUL = 16;
var MAX_X = (480) / PIXMUL;
var MAX_Y = (320) / PIXMUL;
var UP = 'UP';
var RIGHT = 'RIGHT';
var DOWN = 'DOWN';
var LEFT = 'LEFT';
var HIT = 'HIT';
var OOB = 'OOB';
var FOOD = 'FOOD';

function Snake() {
  this.direction = getRandomInt(1, 2);
  this.active = true;
  this.pixels = [[x, y]];
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

function suggestedDirection(snake, food) {
  var head = snake.head();
  var sx = head[0];
  var sy = head[1];

  var fx = food.x;
  var fy = food.y;

  var dx = fx - sx;
  var dy = fy - sy;

  // console.log('sx', sx, 'sy', sy);
  // console.log('fx', fx, 'fy', fy);
  // console.log('dx', dx, 'dy', dy);

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
    else if (dx < 0) {
      sugDir = LEFT;
    }
  }

  return sugDir;
}

function projectedPos(snake, food, direction) {
  var head = snake.head();
  var sx = head[0];
  var sy = head[1];

  var fx = food.x;
  var fy = food.y;

  var px = sx;
  var py = sy;

  switch (direction) {
    case LEFT:
      px -= 1;
      break;

    case RIGHT:
      px += 1;
      break;

    case UP:
      py -= 1;
      break;

    case DOWN:
      py += 1;
      break;
  }

  if (px < 1 || px > MAX_X || py < 1 || py > MAX_Y) {
    return OOB;
  }

  if (px == fx && py == fy) {
    return FOOD;
  }

  if (snake.contains(px, py)) {
    return HIT;
  }

  return [px, py];
}

function deepProjection(snake, food, last, turns) {
  var head = snake.head();
  var sx = head[0];
  var sy = head[1];

  var fx = food.x;
  var fy = food.y;

  var direction = suggestedDirection(snake, food);
  var projPos = projectedPos(snake, food, direction);

  console.log('turn', turns, 'pos', projPos, 'food', [fx, fy]);

  if (projPos == OOB || projPos == HIT || projPos == FOOD) {
    return projPos;
  }

  if (turns < 1) {
    return null;
  }

  var px = projPos[0];
  var py = projPos[1];

  var res = deepProjection(px, py, fx, fy, projPos, turns - 1);
  if (res) {
    return res;
  }

  return last;
}

var snakeContains = false;
function getSnake(x, y) {
  return new Snake(x, y);
}

function getSnakeAndFood(sx, sy, fx, fy) {
  var snake = getSnake(sx, sy);
  var food = { x: fx, y: fy };

  return [snake, food];
}

QUnit.test('when snake is to the left of food', function(assert) {
  var parts = getSnakeAndFood(1, 1, 3, 1);
  var snake = parts[0];
  var food  = parts[1];
  assert.equal(suggestedDirection(snake, food), RIGHT, 'suggests right')
});

QUnit.test('when snake is to the right of food', function(assert) {
  var parts = getSnakeAndFood(3, 1, 1, 1);
  var snake = parts[0];
  var food  = parts[1];
  assert.equal(suggestedDirection(snake, food), LEFT, 'suggests left')
});

QUnit.test('when snake is to the above of food', function(assert) {
  var parts = getSnakeAndFood(1, 1, 1, 5);
  var snake = parts[0];
  var food  = parts[1];
  assert.equal(suggestedDirection(snake, food), DOWN, 'suggests down')
});

QUnit.test('when snake is to the below of food', function(assert) {
  var parts = getSnakeAndFood(1, 5, 1, 1);
  var snake = parts[0];
  var food  = parts[1];
  assert.equal(suggestedDirection(snake, food), UP, 'suggests up')
});

QUnit.test('when snake is to the to the right and below of food', function(assert) {
  var parts = getSnakeAndFood(5, 5, 1, 1);
  var snake = parts[0];
  var food  = parts[1];
  assert.equal(suggestedDirection(snake, food), LEFT, 'suggests left')
});

QUnit.test('when snake is to the to the left and below of food', function(assert) {
  var parts = getSnakeAndFood(1, 5, 5, 1);
  var snake = parts[0];
  var food  = parts[1];
  assert.equal(suggestedDirection(snake, food), RIGHT, 'suggest right')
});

QUnit.test('projecting down', function(assert) {
  var parts = getSnakeAndFood(1, 2, 2, 3);
  var snake = parts[0];
  var food  = parts[1];

  var proj = projectedPos(snake, food, DOWN);
  assert.equal(proj[0], 1);
  assert.equal(proj[1], 3);
});

QUnit.test('projecting up', function(assert) {
  var parts = getSnakeAndFood(1, 2, 4, 4);
  var snake = parts[0];
  var food  = parts[1];

  var proj = projectedPos(snake, food, UP);
  assert.deepEqual(proj, [1, 1]);
});

QUnit.test('projecting right', function(assert) {
  var parts = getSnakeAndFood(1, 2, 2, 3);
  var snake = parts[0];
  var food  = parts[1];

  var proj = projectedPos(snake, food, RIGHT);
  assert.deepEqual(proj, [2, 2]);
});

QUnit.test('projecting left', function(assert) {
  var parts = getSnakeAndFood(2, 2, 2, 3);
  var snake = parts[0];
  var food  = parts[1];

  var proj = projectedPos(snake, food, LEFT);
  assert.deepEqual(proj, [1, 2]);
});

QUnit.test('projecting out of bounds hit', function(assert) {
  var parts = getSnakeAndFood(MAX_X, 1, 2, 3);
  var snake = parts[0];
  var food  = parts[1];

  var proj = projectedPos(snake, food, RIGHT);
  assert.equal(proj, OOB);
});

QUnit.test('projecting own snake hit', function(assert) {
  var parts = getSnakeAndFood(1, 1, 2, 3);
  var snake = parts[0];
  var food  = parts[1];

  snakeContains = true;
  var proj = projectedPos(snake, food, RIGHT);
  snakeContains = false;
  assert.equal(proj, HIT);
});

QUnit.test('deep projection reaching food', function(assert) {
  var parts = getSnakeAndFood(1, 2, 2, 3);
  var snake = parts[0];
  var food  = parts[1];

  var proj = deepProjection(snake, food, null, 1000);
  console.log('proj', proj);
  assert.equal(proj, FOOD);
});

QUnit.test('deep projection reaching food', function(assert) {
  var parts = getSnakeAndFood(1, 1, MAX_X, MAX_Y);
  var snake = parts[0];
  var food  = parts[1];

  var proj = deepProjection(snake, food, null, 1000);
  console.log('proj', proj);
  assert.equal(proj, FOOD);
});
