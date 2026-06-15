let bgImage; 
const tickers = [ "AAPL", "GOOGL", "MSFT", "NVDA", "TSLA", "AMZN", "META", "AMD", "NFLX", "INTC" ]; 
const apikey = "d6liqdpr01qrq6i2tingd6liqdpr01qrq6i2tio0"; 
const url = "https://finnhub.io/api/v1/quote?"; 

let stocks = {}; // Changed to an object for reliable key-value pairing
let targetTicker = ""; 
let targetData; 
let gameState = "loading"; 
let currentGuess = ""; 
let guesses = []; 
const maxGuesses = 6; 

function preload() { 
  // Keep file loading in preload. Ensure this file is uploaded to GitHub!
  bgImage = loadImage("wsb-price-rally.jpg"); 
} 

async function setup() { 
  createCanvas(900, 700); 
  textAlign(CENTER, CENTER); 
  
  // Safely fetch data asynchronously to prevent GitHub Pages page freeze
  await loadMarketData();
  chooseDailyStock(); 
} 

async function loadMarketData() {
  for (let i = 0; i < tickers.length; i++) {
    let ticker = tickers[i];
    let fetchUrl = `${url}symbol=${ticker}&token=${apikey}`;
    try {
      let response = await fetch(fetchUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      stocks[ticker] = await response.json();
    } catch (error) {
      console.error("Failed to fetch data for " + ticker, error);
      // Fallback dummy data if your API token is limited/expired
      stocks[ticker] = { c: 150.00 }; 
    }
  }
}

function chooseDailyStock() { 
  let today = new Date(); 
  let seed = today.getFullYear() + today.getMonth() * 31 + today.getDate(); 
  let index = seed % tickers.length; 
  targetTicker = tickers[index]; 
  
  targetData = stocks[targetTicker]; 
  gameState = "playing"; 
} 

function draw() { 
  background(0); 
  if (bgImage) {
    image(bgImage, 0, 0, width, height); 
  }
  fill(0, 190); 
  rect(0, 0, width, height); 
  drawTitle(); 
  
  if (gameState === "loading") { 
    drawLoading(); 
  } else if (gameState === "playing") { 
    drawBoard(); 
    drawInput(); 
  } else if (gameState === "win") { 
    drawBoard(); 
    drawWin(); 
  } else if (gameState === "lose") { 
    drawBoard(); 
    drawLose(); 
  } 
} 

function drawTitle() { 
  fill(255); 
  textSize(52); 
  text("STOCKLE", width / 2, 60); 
  textSize(23); 
  text("Guess the daily stock ticker", width / 2, 105); 
} 

function drawLoading() { 
  fill(255);
  textSize(30); 
  text("Loading market data...", width / 2, height / 2); 
} 

function drawBoard() { 
  let startY = 160; 
  for (let i = 0; i < maxGuesses; i++) { 
    let y = startY + i * 75; 
    drawRow(i, y); 
  } 
} 

function drawRow(row, y) { 
  let guess = guesses[row]; 
  for (let i = 0; i < 5; i++) { 
    let x = width / 2 - 220 + i * 90; 
    stroke(255); 
    strokeWeight(2); 
    if (guess) { 
      let letter = guess[i] || ""; 
      let targetLetter = targetTicker[i] || ""; 
      if (letter === targetLetter) { 
        fill(0, 180, 0); 
      } else if (targetTicker.includes(letter)) { 
        fill(190, 140, 0); 
      } else { 
        fill(80); 
      } 
      rect(x, y, 70, 70, 12); 
      fill(255); 
      noStroke(); 
      textSize(30); 
      text(letter, x + 35, y + 35); 
    } else { 
      noFill(); 
      rect(x, y, 70, 70, 12); 
    } 
  } 
} 

function drawInput() { 
  fill(255); 
  textSize(26); 
  text(currentGuess, width / 2, 640); 
  textSize(23); 
  text("Type a ticker and press ENTER", width / 2, 675); 
} 

function drawWin() { 
  fill(0, 255, 120); 
  textSize(42); 
  text("YOU WON", width / 2, 630); 
  textSize(21); 
  text("Ticker: " + targetTicker, width / 2, 665); 
} 

function drawLose() { 
  fill(255, 70, 70); 
  textSize(42); 
  text("GAME OVER", width / 2, 620); 
  textSize(24); 
  text("Answer: " + targetTicker, width / 2, 665); 
} 

function keyPressed() { 
  if (gameState !== "playing") { 
    return; 
  } 
  if (keyCode === BACKSPACE) { 
    currentGuess = currentGuess.slice(0, -1); 
  } else if (keyCode === ENTER) { 
    submitGuess(); 
  } else if (key.length === 1 && /[a-zA-Z]/.test(key)) { 
    if (currentGuess.length < 5) { 
      currentGuess += key.toUpperCase(); 
    } 
  } 
} 

function submitGuess() { 
  if (currentGuess.length < 1) { 
    return; 
  } 
  guesses.push(currentGuess); 
  if (currentGuess === targetTicker) { 
    gameState = "win"; 
  } else if (guesses.length >= maxGuesses) { 
    gameState = "lose"; 
  } 
  currentGuess = ""; 
}
