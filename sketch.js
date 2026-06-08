let bgImage;
  //My Daily STOCK LIST

const tickers = [ "AAPL", "GOOGL", "MSFT","NVDA", "TSLA", "AMZN", "META", "AMD", "NFLX", "INTC" ];

// API Stuff
const apiKey = "d6liqdpr01qrq6i2tingd6liqdpr01qrq6i2tio0";
const apiURL = "https://finnhub.io/api/v1/quote?";

// STOCKLE VARIABLES

let stockData = [];
let secretTicker = "";
let playerGuess = "";
let guessHistory = [];
let gameState = "loading";
let maxGuesses = 6;

let funMessages = [ "YOU BEAT THE MARKET TODAY" ];

// PRELOAD

function preload() {

  bgImage = loadImage("wsb-price-rally.jpg");
  for (let i = 0; i < tickers.length; i++) {
stockData[i] = loadJSON( apiURL + "symbol=" + tickers[i] + "&token=" + apiKey);
  }
}
// SETUP
function setup() {
createCanvas(900, 700);
textAlign(CENTER, CENTER);
chooseDailyTicker();
}
// DAILY STOCK PICKER
function chooseDailyTicker() {

let today = new Date();
let dailySeed = today.getFullYear() + today.getMonth() * 50 + today.getDate();
let chosenIndex = dailySeed % tickers.length;
secretTicker = tickers[chosenIndex];

  gameState = "playing";
}
//PICTURE
function draw() {
background(0);
image(bgImage, 0, 0, width, height);
fill(0, 170); 
rect(0, 0, width, height);
drawTitle();

if (gameState === "loading") {
drawLoadingScreen();
  }
  else if (gameState === "playing") {

drawGameBoard();
drawTypingArea();
drawGuessCounter();
  }

  else if (gameState === "win") {

drawGameBoard();
drawVictoryScreen();
  }
  else if (gameState === "lose") {
drawGameBoard();
drawGameOverScreen();
  }
}

// TITLE

function drawTitle() {
fill(255);
textSize(60);
text("STOCKLE", width / 2, 60);
textSize(28);
text( "Guess Today's Mystery Stock TCKR!", width / 2, 105);
}

// LOADING SCREEN

function drawLoadingScreen() {
fill(255);
}
// GAME BOARD

function drawGameBoard() {
let startY = 160;
for (let row = 0; row < maxGuesses; row++) {
drawGuessRow(row, startY + row * 75);
  }
}

// DRAW ONE ROW

function drawGuessRow(rowNumber, yPosition) {
let currentRowGuess = guessHistory[rowNumber];
for (let letterSpot = 0; letterSpot < 5; letterSpot++) {
let xPosition = width / 2 - 220 + letterSpot * 90;
stroke(255);
strokeWeight(2);
if (currentRowGuess) {
let guessedLetter = currentRowGuess[letterSpot] || "";
let result = checkLetter( guessedLetter, letterSpot, secretTicker);


if (result === "correct") {

fill(0, 220, 100);
      }
  

else if (result === "present") {

fill(255, 190, 0);
      }
else {
fill(90);
}
rect(xPosition, yPosition, 70, 70, 15);
fill(255);
noStroke();
textSize(30);
text( guessedLetter, xPosition + 35, yPosition + 35);
    }
    else {
noFill();
  rect(xPosition, yPosition, 70, 70, 15);
    }
  }
}

// Guessing TCKR's
function checkLetter(letter, position, answer) {

  // correct letter in correct position
if (letter === answer[position]) {
    return "correct";
  }
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === letter && i !== position) {
      return "present";
    }
  }
  // gray if it does not belong
  return "wrong";
}
// Guessing Area

function drawTypingArea() {

fill(255);
textSize(30);
text (playerGuess, width / 2, 640);
textSize(25);
}
// Previous guesses

function drawGuessCounter() {
  fill(255);
  textSize(23);
  text( "Guesses Left: " + (maxGuesses - guessHistory.length), width / 2, 138);
}
// WIN SCREEN

function drawVictoryScreen() {
fill(0, 255, 120);
textSize(30);
let randomMessage = funMessages[ floor(random(funMessages.length)) ];
  text(randomMessage, width / 2, 640);
  textSize(24);
}
// LOSE SCREEN

function drawGameOverScreen() {
fill(255, 80, 80);
textSize(40);
text( "The Market Beat You Today!", width / 2, 630);
textSize(24);
text( "Correct ticker: " + secretTicker, width / 2, 670);
}
// KEYBOARD INPUT

function keyPressed() {
if (gameState !== "playing") {
    return;
  }
  
  // Deleting letters
if (keyCode === BACKSPACE) {
    playerGuess = playerGuess.slice(0, -1);
  }
  
  // submit guesses
else if (keyCode === ENTER) {
    submitGuess();
  }
  
  // typing letters
else if (
    key.length === 1 &&
    /[a-zA-Z]/.test(key)
  ) {
if (playerGuess.length < 5) {
  playerGuess += key.toUpperCase();
    }
  }
}
// GUESS CHECKER
function submitGuess() {
if (playerGuess.length < 1) {
    return;
  }
guessHistory.push(playerGuess);
  // player wins
  if (playerGuess === secretTicker) {
    gameState = "win";
  }
  // player loses
  else if ( guessHistory.length >= maxGuesses) {
    gameState = "lose";
  }
  // reset typing box
  playerGuess = "";
}
