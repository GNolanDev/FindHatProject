// start using 'node main.js # # #'
// where # are height & width (3 <= # <= 40), difficulty (0-100)

const prompt = require("prompt-sync")({ sigint: true });
const process = require("process");
const args = process.argv.slice(2);

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(newFieldArray) {
    this.field = newFieldArray;
    this.playerPosition = [0, 0];
  }

  print() {
    let output = [];
    for (const line of this.field) {
      output.push(line.join(""));
    }
    console.log(output.join("\n"));
  }

  beginGame() {
    // print field map
    this.print();
    // prompt user for next move
    this.getNextMove();
  }

  getNextMove() {
    // get user input
    let userMove = prompt("Which Way?");
    console.log(userMove); // test code
    // process the input & see if result is win, loss, next move or illegal move
    // is input u/d/l/r only?
    userMove = userMove.toUpperCase();
    if (!["U", "D", "L", "R"].includes(userMove)) {
      // invalid input
      console.log("Invalid direction - use 'U, D, L or R'.");
      return this.getNextMove();
    }
    // change player position
    this.movePlayer(userMove);
    // test for out of bounds
    if (this.outOfBounds()) {
      // send message and end game
      console.log("You have left the field - game over!");
      return;
    }
    // test for win
    if (this.isWinner()) {
      console.log("Congratulations, you've found your hat!");
      return;
    }
    // test for loss
    if (this.isLoser()) {
      console.log("Oops, you fell in a hole! Game Over!");
      return;
    }
    // update field, reprint and prompt again
    this.field[this.playerPosition[0]][this.playerPosition[1]] = pathCharacter;
    this.print();
    this.getNextMove();
  }

  movePlayer(userMove) {
    // console.log('in moveplayer()');
    // console.log(this.playerPosition);
    switch (userMove) {
      case "U":
        this.playerPosition[0]--;
        break;
      case "D":
        this.playerPosition[0]++;
        break;
      case "R":
        this.playerPosition[1]++;
        break;
      case "L":
        this.playerPosition[1]--;
        break;
      default:
        break;
    }
    // console.log(this.playerPosition);
    return;
  }

  outOfBounds() {
    // return true if playerPosition is outside the field
    return (
      this.playerPosition[0] >= this.field[0].length ||
      this.playerPosition[0] < 0 ||
      this.playerPosition[1] >= this.field[1].length ||
      this.playerPosition[1] < 0
    );
  }

  isWinner() {
    return this.field[this.playerPosition[0]][this.playerPosition[1]] === hat;
  }

  isLoser() {
    return this.field[this.playerPosition[0]][this.playerPosition[1]] === hole;
  }

  static generateField(height, width, diff) {
    // diff is a difficulty, set as percentage, default to 30%
    diff = typeof diff === "number" && diff <= 100 && diff >= 0 ? diff : 30;
    // check type & value of h & w, set default if invalid
    height =
      typeof height === "number" && height <= 40 && height >= 3 ? height : 5;
    width = typeof width === "number" && width <= 40 && width >= 3 ? width : 5;
    const numOfSquares = height * width;
    const numOfHoles = Math.floor((numOfSquares * diff) / 100);
    const newField = [];
    // create array of field characters row by row
    for (let j = 0; j < height; j++) {
      let fieldRow = [];
      for (let i = 0; i < width; i++) {
        fieldRow.push(fieldCharacter);
      }
      newField.push(fieldRow);
    }

    // add start character
    newField[0][0] = pathCharacter;

    // add holes at random
    let i = 0;
    while (i < numOfHoles) {
      const holeRow = Math.floor(Math.random() * height);
      const holeCol = Math.floor(Math.random() * width);
      // discard any holes in invalid places or duplicates
      if (
        (holeRow == 0 && holeCol == 0) ||
        newField[holeRow][holeCol] === hole
      ) {
        // try getting a new hole, without incrementing i
        continue;
      }
      newField[holeRow][holeCol] = hole;
      i++;
    }

    // add the hat at random
    i = 0;
    do {
      const hatRow = Math.floor(Math.random() * height);
      const hatCol = Math.floor(Math.random() * width);
      // discard any hat in an invalid place
      if (hatRow == 0 && hatCol == 0) {
        // try getting a new hat, without incrementing i
        continue;
      }
      newField[hatRow][hatCol] = hat;
      i++;
    } while (i < 1);

    return newField;
  }
}

// get field arguments from user or set defaults of 5, 5, 30%
let height = Number(args[0]);
let width = Number(args[1]);
let diff = Number(args[2]);
diff = typeof diff === "number" && diff <= 100 && diff >= 0 ? diff : 30;
height = typeof height === "number" && height <= 40 && height >= 3 ? height : 5;
width = typeof width === "number" && width <= 40 && width >= 3 ? width : 5;

const playingField = new Field(Field.generateField(height, width, diff));
playingField.beginGame();
