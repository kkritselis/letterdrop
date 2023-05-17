let loadingImg, menuImg, startBtnImg, tiles;
let gameStarted = false;
let windowW = 1620;
let windowH = 1024;
const LEVELS = [
  { wordLength: 4, numLetters: 3 },
  { wordLength: 5, numLetters: 4 },
  { wordLength: 6, numLetters: 5 },
  { wordLength: 7, numLetters: 6 },
  { wordLength: 8, numLetters: 7 },
  { wordLength: 9, numLetters: 8 },
  { wordLength: 10, numLetters: 9 }
];
let foregroundImg;
let currentLevel = -1; // Current level index
let currentWord = ''; // Current word being solved
let bottomRow = []; // Array of letter tiles on bottom row
let topRow = []; // Array of letter tiles on top row
let images = {};

function preload() {
  // Load your images and scripts here
  tiles = loadImage('img/letters.png');
  loadingImg = loadImage('img/loading.png');
  menuImg = loadImage('img/menu.png');
  startBtnImg = loadImage('img/button.png');
  foregroundImg = loadImage('img/foreground.png');

  // Call the functions that require the images to be loaded
  tiles.loadPixels();
  processImages();
  tiles.updatePixels();
}

function setup() {
  // Create the canvas
  createCanvas(windowW, windowH);

  // Draw the loading screen
  image(loadingImg, 0, 0, windowW, windowH);
}

function draw() {
  if (!gameStarted) {
    // Draw the menu and the start button
    image(
      menuImg,
      (windowWidth - menuImg.width) / 3,
      (windowHeight - menuImg.height) / 3,
      menuImg.width,
      menuImg.height
    );
    image(
      startBtnImg,
      windowWidth / 2 - startBtnImg.width / 2,
      windowHeight / 2 - startBtnImg.height / 2,
      startBtnImg.width / 2,
      startBtnImg.height / 1.25
    );
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Start Game", 15 + width / 2, 85 + height / 2);
  } else {
    // Game logic goes here
  }
}

function mouseClicked() {
  // If the start button is clicked
  if (
    !gameStarted &&
    mouseX > windowWidth / 2 - startBtnImg.width / 2 &&
    mouseX <
      windowWidth / 2 + (startBtnImg.width / 2) / 2 &&
    mouseY > windowHeight / 2 - startBtnImg.height / 2 &&
    mouseY < windowHeight / 2 + (startBtnImg.height / 1.25) / 2
  ) {
    gameStarted = true;
    console.log("clicked");
    currentLevel = 0;
    startLevel();
  }
}

function startLevel() {
    // Start a new level
    currentWord = getRandomWord(LEVELS[currentLevel].wordLength);
    console.log('word:', currentWord);
    fullList = wordList[currentWord];
    bottomRow = [];
    topRow = currentWord.split('');
  
    setTimeout(() => {
      bottomRow = currentWord.split('');
      console.log('topRow:', topRow);
      console.log('bottomRow:', bottomRow);
    }, 5000);
  }
  
  function getRandomWord(length) {
    console.log('getRandomWord');
    // Get a random word of given length
    const words = wordLib[length];
    return words[floor(random(words.length))];
  }
  
  function processImages() {
    let i = 65;
    for (let row = 0; row <= 539; row += 90) {
      for (let col = 0; col <= 449; col += 90) {
        const letter = String.fromCharCode(i).toLowerCase();
        images[letter] = tiles.get(col, row, 90, 90);
        i++;
      }
    }
  }
  