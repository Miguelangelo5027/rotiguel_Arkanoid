
var c = document.getElementById("myArkanoid");
var ctx = c.getContext("2d");

var radius = 10;
var puntoX = c.width / 2;
var puntoY = c.height - 10;

var dx = 2;
var dy = -2;

var paddleX = c.width / 2;
var paddleY = c.height - 10;
var paddleW = 100;
var paddleH = 7;

var rightMove = false;
var leftMove = false;

//Filas y columnas aleatorias cada inicio
var bricksRows = Math.floor(Math.random() * 4) + 2;     // Entre 2 y 5 filas
var bricksColumns = Math.floor(Math.random() * 6) + 3;  // Entre 3 y 8 columnas

var brickWidth = 60;
var brickHeight = 20;

var brickPadding = 12;
var brickOffsetTop = 30;
var brickOffsetLeft = 60;
var bricks = [];

for (var i = 0; i < bricksColumns; i++) {
    bricks[i] = [];
    for (var j = 0; j < bricksRows; j++) {
        var isLifeBrick = Math.random() < 0.2; // 20% bloque vida
        bricks[i][j] = { 
            x: 0, 
            y: 0, 
            drawBrick: true,
            type: isLifeBrick ? "life" : "normal"
        };
    }
}

var score = 0;
var lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 37) leftMove = true;
    else if (e.keyCode == 39) rightMove = true;
}

function keyUpHandler(e) {
    if (e.keyCode == 37) leftMove = false;
    else if (e.keyCode == 39) rightMove = false;
}

function mouseMoveHandler(e) {
    var mouseRelativeX = e.clientX - c.offsetLeft;
    if (mouseRelativeX > 0 && mouseRelativeX < c.width) {
        paddleX = mouseRelativeX - paddleW / 2;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(puntoX, puntoY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0066cc";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleW, paddleH);
    ctx.fillStyle = "#FF3300";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var i = 0; i < bricksColumns; i++) {
        for (var j = 0; j < bricksRows; j++) {
            if (bricks[i][j].drawBrick) {
                var bx = i * (brickWidth + brickPadding);
                var by = j * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[i][j].x = bx;
                bricks[i][j].y = by;

                ctx.beginPath();
                ctx.rect(bx, by, brickWidth, brickHeight);

                if (bricks[i][j].type === "life") {
                    ctx.fillStyle = "#00CC66"; // Verde vida
                } else {
                    ctx.fillStyle = "#FF3300"; // Rojo normal
                }

                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function detectHits() {
    for (var i = 0; i < bricksColumns; i++) {
        for (var j = 0; j < bricksRows; j++) {
            var brick = bricks[i][j];
            if (brick.drawBrick) {
                if (puntoX > brick.x && puntoX < brick.x + brickWidth &&
                    puntoY > brick.y && puntoY < brick.y + brickHeight) {

                    dy = -dy;
                    brick.drawBrick = false;

                    if (brick.type === "life") {
                        lives++;
                    } else {
                        score++;
                    }

                    if (score === (bricksRows * bricksColumns)) {
                        alert("¡Nivel completado!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033CC";
    ctx.fillText("Score: " + score, 10, 20);
}

function drawLives() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033CC";
    ctx.fillText("Lives: " + lives, c.width - 100, 20);
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    detectHits();

    if (puntoX + dx > c.width - radius || puntoX + dx < radius) dx = -dx;

    if (puntoY + dy < radius) {
        dy = -dy;
    } else if (puntoY + dy > c.height - radius) {
        if (puntoX > paddleX && puntoX < paddleX + paddleW) {
            dy = -dy;
        } else {
            lives--;
            if (lives < 1) {
                gameOver();
                return;
            } else {
                puntoX = c.width / 2;
                puntoY = c.height - 10;
                dx = 2;
                dy = -2;
                paddleX = c.width / 2;
            }
        }
    }

    if (leftMove && paddleX > 0) paddleX -= 8;
    if (rightMove && paddleX < c.width - paddleW) paddleX += 8;

    puntoX += dx;
    puntoY += dy;

    requestAnimationFrame(draw);
}

function gameOver() {
    document.getElementById("myArkanoidGameOver").style.display = "block";
}

draw();
