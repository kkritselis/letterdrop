const BOX_SIZE = 80; // Size of each letter box
const BOX_MARGIN = 20; // Margin between letter boxes
const BOTTOM_ROW_Y = 2/3 * 600 - BOX_SIZE / 2; // Y-coordinate of bottom row
const TOP_ROW_Y = 1/3 * 600 - BOX_SIZE / 2; // Y-coordinate of top row
const LEVELS = [
  { wordLength: 4, numLetters: 3 },
  { wordLength: 5, numLetters: 4 },
  { wordLength: 6, numLetters: 5 },
  { wordLength: 7, numLetters: 6 },
  { wordLength: 8, numLetters: 7 },
  { wordLength: 9, numLetters: 8 },
  { wordLength: 10, numLetters: 9 }
];
let bkgdimg;
let currentLevel = -1; // Current level index
let currentWord = ''; // Current word being solved
let bottomRow = []; // Array of letter tiles on bottom row
let topRow = []; // Array of letter tiles on top row
let fullList = []; // Array of all valid words

let images = {};

function preload() {
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i).toLowerCase();
        const filename = 'img/letter_' + letter.toLowerCase() + '.png';
        images[letter] = loadImage(filename);
    }
    bkgdimg = loadImage('img/background.png');
}

function setup() {
    console.log("setup");
    const canvas = createCanvas(800, 600);
    canvas.parent('container');
    textAlign(CENTER, CENTER);
    textSize(32);
    noStroke();
}

function draw() {
    console.log("draw");
    if (currentLevel === -1) {
    drawStartMenu();
    } else {
    drawGame();
    }
}

function drawStartMenu() {
    console.log("drawStartMenu");
    // Draw start menu with "Start Game" button
    const bkgdimg = loadImage('img/background.png');
    image(bkgdimg, 0, 0, width, height);
    fill(0);
    text('Start Game', width/2, height/2);
}

function drawGame() {
    console.log("drawGame");
  // Draw game with letter tiles and boxes
  drawBoxes(BOTTOM_ROW_Y, LEVELS[currentLevel].numLetters);
  drawBoxes(TOP_ROW_Y, currentWord.length);
  drawLetters(BOTTOM_ROW_Y, bottomRow);
  drawLetters(TOP_ROW_Y, topRow);
  drawLevelText();
}

function drawBoxes(y, numBoxes) {
    console.log("drawBoxes");
    // Draw letter boxes
    const xStart = width / 2 - (numBoxes * BOX_SIZE + (numBoxes - 1) * BOX_MARGIN) / 2;
    for (let i = 0; i < numBoxes; i++) {
      const x = xStart + (i * (BOX_SIZE + BOX_MARGIN));
      rect(x, y, BOX_SIZE, BOX_SIZE, 10);
    }
}
  
function drawLetters(y, letters) {
    console.log("drawLetters");
    // Draw letter tiles
    const xStart = width / 2 - (letters.length * BOX_SIZE + (letters.length - 1) * BOX_MARGIN) / 2;
    for (let i = 0; i < letters.length; i++) {
        const x = xStart + (i * (BOX_SIZE + BOX_MARGIN));
        image(images[letters[i].toLowerCase()], x, y, BOX_SIZE, BOX_SIZE);
    }
}
  
function drawLevelText() {
    console.log("drawLevelText");
    // Draw level text
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(`Level ${currentLevel + 1}`, width / 2, height / 6);
}
  
let dragging = false; // A flag to check if a tile is being dragged
let dragIndex = -1; // Index of the tile being dragged



function mousePressed() {
    console.log("mousePressed");
    // Handle mouse click
    if (currentLevel === -1) {
      // Start game
      currentLevel = 0;
      startLevel();
    } else if (bottomRow.length === 1) {
      // Check answer
      const answer = bottomRow[0] + topRow.join('');
      if (fullList.includes(answer)) {
        if (currentLevel === LEVELS.length - 1) {
          // Game over, you win!
          currentLevel = -1;
          setTimeout(() => alert('You win!'), 500);
        } else {
          // Move on to next level
          currentLevel++;
          startLevel();
        }
      } else {
        // Game over, you lose!
        currentLevel = -1;
        setTimeout(() => alert('Game over!'), 500);
      }
    }

    for (let i = 0; i < topRow.length; i++) {
        if (mouseX > topRow[i].x && mouseX < topRow[i].x + BOX_SIZE && mouseY > topRow[i].y && mouseY < topRow[i].y + BOX_SIZE) {
          dragging = true;
          dragIndex = i;
          break;
        }
      }
}
  
  function mouseDragged() {
    console.log("mouseDragged");
    // Handle mouse drag
    if (bottomRow.length === LEVELS[currentLevel].numLetters) {
      // Bottom row is full, cannot add more letters
      return;
    }
    // Find letter tile being dragged
    const xStart = width / 2 - (topRow.length * BOX_SIZE + (topRow.length - 1) * BOX_MARGIN) / 2;
    const index = floor((mouseX - xStart) / (BOX_SIZE + BOX_MARGIN));
    if (index < 0 || index >= topRow.length) {
      // Invalid index, ignore drag
      return;
    }

    // If a tile is being dragged, update its position to the mouse position
    if (dragging && dragIndex != -1) {
        topRow[dragIndex].x = mouseX - BOX_SIZE / 2;
        topRow[dragIndex].y = mouseY - BOX_SIZE / 2;
    }

    // Remove letter tile from top row and add to bottom row
    const letter = topRow.splice(index, 1)[0];
    bottomRow.push(letter);
}

// mouseReleased is a p5.js function that gets called whenever a mouse button is released
function mouseReleased() {
    // When the mouse is released, stop dragging the tile
    if (dragging && dragIndex != -1) {
        // Check if the tile is over the bottom row and move it if it is
        if (mouseY > BOTTOM_ROW_Y && mouseY < BOTTOM_ROW_Y + BOX_SIZE) {
            bottomRow.push(topRow.splice(dragIndex, 1)[0]);
        } else {
            // If the tile is not over the bottom row, return it to its original position
            topRow[dragIndex].x = TOP_ROW_Y;// original x position
            topRow[dragIndex].y = TOP_ROW_Y;// original y position
        }
    }
    dragging = false;
    dragIndex = -1;
}  
  
function startLevel() {
    console.log("startLevel");
    // Start a new level
    currentWord = getRandomWord(LEVELS[currentLevel].wordLength);
    console.log('word:', currentWord);
    fullList = wordList[currentWord];
    bottomRow = [];
    topRow = currentWord.split(''); //.splice(0, LEVELS[currentLevel].numLetters - 1);
    console.log('word:', topRow);
    setTimeout(() => {
      bottomRow = currentWord.split('');//.splice(LEVELS[currentLevel].numLetters - 1);
    }, 5000);
}
  
function getRandomWord(length) {
    console.log("getRandomWord");
    // Get a random word of given length
    const words = wordLib[length];
    return words[floor(random(words.length))];
}
  