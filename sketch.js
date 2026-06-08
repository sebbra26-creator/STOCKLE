let stocks = [];
let bgImage;

let tickers = [
"AAPL","GOOGL","MSFT","NVDA","TSLA",
"AMZN","META","AMD","NFLX","INTC",
];

let apikey = "d6liqdpr01qrq6i2tingd6liqdpr01qrq6i2tio0";
let url = "https://finnhub.io/api/v1/quote?";

let state = "memorize";
let startTime;

let inputTicker = "";
let inputPlace = "";

let question = 0;
let score = 0;

let sorted = [];
let enteringPlacement = false;

function preload() {

bgImage = loadImage("wsb-price-rally.jpg");

  for (let i = 0; i < tickers.length; i++) {
    stocks[i] = loadJSON(
      url + "symbol=" + tickers[i] + "&token=" + apikey
    );
  }
}

function setup() {

  createCanvas(900, 650);

  textAlign(CENTER, CENTER);
  textSize(25);

  startTime = millis();

  let stockData = [];

  for (let i = 0; i < stocks.length; i++) {

    stockData.push({
      ticker: tickers[i],
      price: stocks[i].c
    });

  }

  stockData.sort(function(a, b) {
    return b.price - a.price;
  });

  for (let i = 0; i < stockData.length; i++) {
    sorted.push(stockData[i].ticker);
  }
}

function draw() {

  image(bgImage, 0, 0, width, height);

  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);

  if (state == "memorize") {

    textSize(32);
    text("STOCKLE", width / 2, 50);

    textSize(23);

    for (let i = 0; i < tickers.length; i++) {

      let y = 120 + i * 32;

      text(
        tickers[i] + "   $" + nf(stocks[i].c, 1, 2),
        width / 2,
        y
      );
    }

    let remaining = 30 - floor((millis() - startTime) / 1000);

    textSize(27);
    text("Time Remaining: " + remaining, width / 2, 600);

    if (remaining <= 0) {
      state = "game";
    }
  }

  if (state == "game") {

    textSize(28);
    text("Type the Stock TCKR", width / 2, 70);

    textSize(35);
    text("Stock #" + (question + 1), width / 2, 240);

    textSize(40);
    text(inputTicker, width / 2, 300);

    textSize(24);
    text("Press ENTER After Typing TCKR", width / 2, 415);

    if (enteringPlacement) {

      textSize(32);
      text("Placement:", width / 2, 350);

      textSize(30);
      text(inputPlace, width / 2, 380);
    }
  }

  if (state == "result") {
 textSize(32);
    text("STOCKLE", width / 2, 50);
    textSize(52);
    text("GAME OVER", width / 2, 250);

    textSize(40);
    text("Score: " + score, width / 2, 350);
  }
}

function keyPressed() {

  if (state == "game") {

    if (!enteringPlacement) {

      if (keyCode === ENTER) {

        if (inputTicker.toUpperCase() == sorted[question]) {
          score += 1;
        }

        enteringPlacement = true;
      }

      else if (keyCode === BACKSPACE) {
        inputTicker = inputTicker.slice(0, -1);
      }

      else if (key.length === 1) {
        inputTicker += key;
      }
    }

    else {

      if (keyCode === ENTER) {

        let place = int(inputPlace);

        if (place == question + 1) {
          score += 1;
        }

        inputTicker = "";
        inputPlace = "";
        enteringPlacement = false;

        question++;

        if (question >= sorted.length) {
          state = "result";
        }
      }

      else if (keyCode === BACKSPACE) {
        inputPlace = inputPlace.slice(0, -1);
      }

      else if (key.length === 1) {
        inputPlace += key;
      }
    }
  }
}