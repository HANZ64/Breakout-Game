let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');

let originalCanvasWidth = canvas.width;
let currentCanvasWidth = canvas.getBoundingClientRect().width;
let canvasWidthRatio = originalCanvasWidth / currentCanvasWidth;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 5;
let dy = -5;
let ballRadius = 9;
let paddleHeight = 11;
let paddleWidth = 93;
let paddleX = (canvas.width-paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 5;
let brickColumnCount = 8;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;

let bricks = [];
for (c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for (r=0; r<brickRowCount; r++) {
    bricks[c][r] = {x: 0, y:0, status: 1};
  }
}

function drawBricks() {
  for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for(c=0; c<brickColumnCount; c++){
    for(r=0; r<brickRowCount; r++){
      let b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score > 2) {
            dx = 5;
            dy = -6;
            dy = -dy;
          }
          if(score > 5) {
            dx = 5;
            dy = -7;
            dy = -dy;
          }
          if(score > 10) {
            dx = 5;
            dy = -8;
            dy = -dy;
          }
          if(score > 15) {
            dx = 7;
            dy = -7;
            dy = -dy;
          }
          if(score > 20) {
            dx = 5;
            dy = -9;
            dy = -dy;
          }
          if(score > 25) {
            dx = 8;
            dy = -8;
            dy = -dy;
          }
          if(score > 30) {
            dx = 6;
            dy = -11;
            dy = -dy;
          }
          if(score > 35) {
            dx = 7;
            dy = -13;
            dy = -dy;
            paddleWidth = 94;
          }
          if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN! Congratulations :)");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore () {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBricks()
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if(y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if(!lives) {
        alert("GAME OVER! Try Again.");
        document.location.reload();
      } else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 5;
        dy = -5;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 13;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 13;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}
draw();

// Keyboard keys logic (left/right)
function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true;
  }
  else if(e.keyCode == 37) {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  }
  else if(e.keyCode == 37) {
    leftPressed = false;
  }
}
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Mouse control logic
function mouseMoveHandler(e) {
  let relativeX = (e.clientX - canvas.offsetLeft) * canvasWidthRatio;
  if(relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
    paddleX = relativeX - paddleWidth/2;
  }
}
document.addEventListener("mousemove", mouseMoveHandler);

// Touch device logic
function touchMoveHandler(e) {
  let relativeX = (e.touches[0].clientX - canvas.offsetLeft) * canvasWidthRatio;
  if(relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
    paddleX = relativeX - paddleWidth/2;
  }
}
document.addEventListener("touchmove", touchMoveHandler);

// Reload page after canvas resize
function setResizeHandler(callback, timeout) {
  let timer_id = undefined;
  window.addEventListener("resize", function() {
      if(timer_id != undefined) {
          clearTimeout(timer_id);
          timer_id = undefined;
      }
      timer_id = setTimeout(function() {
          timer_id = undefined;
          callback();
      }, timeout);
  });
}
function callback() {
  location.reload();
}
setResizeHandler(callback, 200);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
