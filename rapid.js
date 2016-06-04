const PIX_SIZE = 8;
const UP = 'UP';
const DOWN = 'DOWN';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

function indexOf(snake, p) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i][0] === p[0] && snake[i][1] === p[1]) {
      return i;
    }
  }

  return -1;
}

function removePoint(snake, r) {
  _.forEach(snake, (p, i) => {
    if (_.isEqual(p, r)) {
      snake.splice(i, 1);
      return false;
    }
  });
}

function orderSnake(snake, head) {
  let result = [head];
  let cur = head;
  removePoint(snake, head);

  while (snake.length > 0) {
    let cx = cur[0];
    let cy = cur[1];

    const match = _.find(snake, (p) => {
      let sx = p[0];
      let sy = p[1];

      let dx = Math.abs(sx - cx);
      let dy = Math.abs(sy - cy);

      if ((dx === 0 && dy === 1) || (dx === 1 && dy === 0)) {
        return true;
      }

      return false;
    });

    if (!match) {
      console.log('No match for', cur);
      break;
    }

    _.pull(snake, match);
    result.push(match);
    cur = match;
  }

  return result;
}

function gameFrom(s) {
  const lines = s.trim().split('\n');
  const snake = [];
  const food = [];

  let head = null;

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y].trim();
    for (let x = 0; x < line.length; x++) {
      const c = line[x];
      if (c === 'S' || c === 'H') {
        snake.push([x, y]);
      }
      if (c === 'H') {
        head = [x, y];
      }
      if (c === 'F') {
        food[0] = x;
        food[1] = y;
      }
    }
  }

  const newSnake = orderSnake(snake, head);

  return {
    width: lines[0].length,
    height: lines.length,
    snake: newSnake,
    head: head,
    food: food
  }
}

function drawPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PIX_SIZE, y * PIX_SIZE, PIX_SIZE, PIX_SIZE);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function drawGame(gameStr) {
  const game = gameFrom(gameStr);
  const snake = game.snake;
  const food = game.food;

  draw(snake, food, game.width, game.height);
}

function draw(snake, food, width, height, bg) {
  const canvas = document.createElement('canvas');
  canvas.width = width * PIX_SIZE;
  canvas.height = height * PIX_SIZE;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';

  const main = document.getElementById('main');
  main.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  console.log('bg', bg);
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  for (let i = 0; i < snake.length; i++) {
    var x = snake[i][0];
    var y = snake[i][1];
    drawPixel(ctx, x, y, 'black');
  }

  drawPixel(ctx, snake[0][0], snake[0][1], 'red')

  drawPixel(ctx, food[0], food[1], 'blue');
  ctx.fillStyle = '#444';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function distance(pa, pb) {
  let dx = Math.abs(pa[0] - pb[0]);
  let dy = Math.abs(pa[1] - pb[1]);

  return dx + dy;
}

function without(arr, point) {
  const result = [];
  let removed = false;
  _.forEach(arr, p => {
    if (removed || !_.isEqual(p, point)) {
      result.push(p);
      removed = true;
    }
  });
  return result;
}

function contains(arr, point) {
  return without(arr, point).find(p => _.isEqual(p, point));
}

function hasCollision(game) {
  const food = game.food;

  let snake = _.cloneDeep(game.snake);
  let head = game.head;

  const hx = head[0];
  const hy = head[1];
  const fx = food[0];
  const fy = food[1];

  // determine position of food in relation to the head
  const dx = hx - fx;
  const dy = hy - fy;

  // trends for x and y
  let tx = 0;
  let ty = 0;
  if (dx != 0) {
    tx = dx > 0 ? LEFT : RIGHT;
  }
  if (dy != 0) {
    ty = dy > 0 ? UP : DOWN;
  }

  // console.log('hx', hx, 'hy', hy, '| fx', fx, 'fy', fy, '| dx', dx, 'dy', dy, '| tx', tx, 'ty', ty);

  // current x and y
  let cx = head[0];
  let cy = head[1];

  // scans horizontally then vertically from the head to the food
  // looking for snake parts and edges
  let collision = false;
  while (true) {
    head = snake[0];
    let cx = head[0];
    let cy = head[1];

    draw(snake, game.food, game.width, game.height, '#eee');

    if (cx < 0 || cy < 0 || cx > game.width || cy > game.height) {
      return true;
    }

    if (cx == fx && cy == fy) {
      return false;
    }

    if (contains(snake, [cx, cy])) {
      return true;
    }

    if (cx != fx) {
      // adds the "trend", either -1 or +1 depending on the positon
      // of the food in regards to the head
      snake = move(snake, tx);
    }
    else if (cy != fy) {
      snake = move(snake, ty);
    }
  }

  return collision;
}

function score(game) {
  const head = game.snake[0];
  const dist = -distance(head, game.food);
  const collision = hasCollision(game);

  console.log(JSON.stringify(head), JSON.stringify(game.food), 'dist', dist, 'collision', collision);

  // the largest the distance, the lesser the score
  return (collision ? 10 : 100) + dist;
}

function move(snake, direction) {
  const deltas = {
    RIGHT: { x: 1, y: 0},
    LEFT: { x: -1, y: 0},
    UP: { x: 0, y: -1},
    DOWN: { x: 0, y: 1 }
  };
  const head = snake[0];
  const result = snake.map(p => p);
  const delta = deltas[direction];
  result.unshift([head[0]+delta.x, head[1]+delta.y]);
  result.pop();
  return result;
}

function main() {
  //..|....1....|....2....|....3
  const game = gameFrom(`
    .S............................
    .S............................
    .S............................
    .S..HS........................
    .S...S........................
    .SSSSS........................
    ..............................
    ..............................
    .F............................
    ..............................
    ..............................
    ..............................
    ..............................
  `);

  draw(game.snake, game.food, game.width, game.height);
  console.log(score(game));

  game.snake = move(game.snake, UP);
  game.snake = move(game.snake, RIGHT);
  game.snake = move(game.snake, RIGHT);
  game.snake = move(game.snake, DOWN);
  game.snake = move(game.snake, DOWN);
  game.snake = move(game.snake, DOWN);
  game.snake = move(game.snake, DOWN);
  draw(game.snake, game.food, game.width, game.height);
  console.log(score(game));
  // game.snake = move(game.snake, UP);
  // draw(game.snake, game.food, game.width, game.height);
  // game.snake = move(game.snake, UP);
  // draw(game.snake, game.food, game.width, game.height);
  // game.snake = move(game.snake, LEFT);
  // draw(game.snake, game.food, game.width, game.height);
  // console.log('game.snake', game.snake);

  // drawGame(`
  // ..............................
  // .S.....HSSSS..................
  // .S.........S..................
  // .S...SSSSSSS..................
  // .S...S........................
  // .SSSSS........................
  // ..............................
  // ..............................
  // .F............................
  // ..............................
  // ..............................
  // ..............................
  // ..............................
  // `);
}

document.body.onload = main;
