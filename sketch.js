let paddleWidth = 100;
let paddleHeight = 20;
let paddleSpeed = 5;
let playerPaddle, computerPaddle;
let ball;
let ballSpeedX, ballSpeedY;
let ballRadius = 10;
let playerScore = 0;
let computerScore = 0;

let img;
let shadowOffset;
let shadowColor;
let textColor;
let customFont;
let customFont2;
let countdownDate;
let shadowTimeout;

function preload() {
  // Load the JPG image
  img = loadImage("פוסטר-02.jpg");
  customFont = loadFont("Heebo-Bold.ttf");
  customFont2 = loadFont("digital-7.ttf");
}

function setup() {
  createCanvas(841, 1190);

  shadowOffset = 1;
  shadowColor = color(137, 153, 64);
  textColor = color(208, 216, 42); // Text color

  //טיימר שסופר לארוך לתאריך של הטורניר ב15 בינואר 2024
  resetGame(); // Initialize the game state
  countdownDate = new Date("January 15, 2024 00:00:00 UTC");
}

function draw() {
  background(220);

  // Display the image on the canvas
  image(img, 0, 0);

  let paddleWidth = 120;
  let paddleHeight = 8;

  // Draw paddles
  fill(65, 66, 71);
  rectMode(CENTER);
  rect(playerPaddle.x, playerPaddle.y, paddleWidth, paddleHeight);
  rect(computerPaddle.x, computerPaddle.y, paddleWidth, paddleHeight);

  // השליטה במחבט של ה״שחקן״ היא על ידי מקשי החצים
  if (keyIsDown(LEFT_ARROW)) {
    playerPaddle.x -= paddleSpeed;
  } else if (keyIsDown(RIGHT_ARROW)) {
    playerPaddle.x += paddleSpeed;
  }

  // הגבלת התנועה של המחבט של ״השחקן״ על ציר האיקס
  playerPaddle.x = constrain(
    playerPaddle.x,
    90 + paddleWidth / 2,
    750 - paddleWidth / 2
  );

  //מהירות הכדור ומיקומו במרחב הקנבס
  ball.x += ballSpeedX;
  ball.y += ballSpeedY;

  // נקודת ההשקה של הכדור עם המחבט של ״השחקן״
  if (
    ball.y + ballRadius >= playerPaddle.y - paddleHeight / 2 &&
    ball.y + ballRadius <= playerPaddle.y + paddleHeight / 2 &&
    ballSpeedY > 0
  ) {
    if (
      ball.x + ballRadius >= playerPaddle.x - paddleWidth / 2 &&
      ball.x - ballRadius <= playerPaddle.x + paddleWidth / 2
    ) {
      ballSpeedY *= -1;
    }
  }

  // נקודת ההשקה של הכדור עם המחבט של ״המחשב״
  if (
    ball.y - ballRadius <= computerPaddle.y + paddleHeight / 2 &&
    ball.y - ballRadius >= computerPaddle.y - paddleHeight / 2 &&
    ballSpeedY < 0
  ) {
    if (
      ball.x + ballRadius >= computerPaddle.x - paddleWidth / 2 &&
      ball.x - ballRadius <= computerPaddle.x + paddleWidth / 2
    ) {
      ballSpeedY *= -1;
    }
  }

  // נקודת ההשקה של הכדור עם הקירות
  if (ball.x + ballRadius >= width) {
    playerScore++;
    resetBall();
  } else if (ball.x - ballRadius <= 0) {
    computerScore++;
    resetBall();
  }

  // נקודת ההשקה של הכדור עם התקרה
  if (ball.y - ballRadius <= 28 && ballSpeedY < 0) {
    playerScore++;
    resetBall();
  }

  // עשה ריסטארט למשחק ברגע שהכדור יוצא מגבולות הקנבס
  if (ball.y - ballRadius > height) {
    computerScore++;
    resetBall();
  }

//הצל של הכדור
  fill(0, 0, 0, 50); // Set the color of the shadow
  ellipse(ball.x + 8, ball.y + 8, ballRadius * 2.3); // Draw a slightly offset ellipse for the shadow

  // Draw ball
  fill(208, 216, 42);
  noStroke();
  ellipse(ball.x, ball.y, ballRadius * 2.3);

  // הכותרת australian open והצל שלה
  textFont(customFont);
  fill(shadowColor);
  textSize(50);
  if (playerScore > computerScore) {
    text("AUSTRALIAN OPEN", 310 + shadowOffset, 145 + shadowOffset);
  }

  fill(textColor);
  text("AUSTRALIAN OPEN", 315, 140);

  drawCountdown();
  drawScores();
}

function drawCountdown() {
  let currentDate = new Date();
  let timeRemaining = countdownDate - currentDate;

  // הטיימר שסופר לאחור לתאריך הטורניר מוצג בשעות, דקות ושניות
  let hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // Display the countdown
  textAlign(CENTER, CENTER);
  textFont(customFont2);
  fill(137, 153, 64);
  textSize(40);
  text(hours + ":" + nf(minutes, 2) + ":" + nf(seconds, 2), 680, 1080);
}

//הנקודות של השחקנים
function drawScores() {
  textAlign(CENTER, CENTER);
  textFont(customFont2);
  fill(137, 153, 64);
  textSize(40);
  text("   : P" + playerScore, 705, 150);
  text("C" + computerScore, 665, 150);
}

function resetBall() {
  ball = createVector(width / 2, height / 2);
  ballSpeedX = random(-3, 3);
  ballSpeedY = random(2, 5);

  // הצל של הכותרת מופעל ברגע שה״שחקן״ מקבל נקודה
  if (playerScore > computerScore) {
    shadowOffset = 2;
    shadowColor = color(137, 153, 64);


    //הצל שהופעל מתאפס לאחר שתי שניות
    shadowTimeout = setTimeout(function () {
      shadowOffset = 1;
      shadowColor = color(0, 0, 0, 0);
    }, 2000);
  }

  // ברגע שאחד השחקנים מגיע ל10 נקודות המשחק מופעל מחדש
  if (playerScore === 10 || computerScore === 10) {
    resetGame(); // Restart the game
  }
}

// מצב המשחק לאחר שעושים ריסטארט
function resetGame() {
  playerPaddle = createVector(width / 2, 930);
  computerPaddle = createVector(width / 2, 290);
  playerScore = 0;
  computerScore = 0;
  resetBall();
}

//השליטה בתנועה של המחבט של ה״מחשב״ היא על ידי הזזה של העכבר 
function mouseMoved() {
  // Move the computer paddle with the mouse
  computerPaddle.x = mouseX;

  // טווח התנועה של המחבט של ה״מחשב״ לאורך ציר האיקס
  computerPaddle.x = constrain(
    computerPaddle.x,
    90 + paddleWidth / 2,
    750 - paddleWidth / 2
  );
}

// המשחק מתחיל מחדש בהקלקה על העכבר
function mouseClicked() {
  resetGame(); // Reset the game state
}