
let images = [
  "dice-1-b.png",
  "dice-2-b.png",
  "dice-3-b.png",
  "dice-4-b.png",
  "dice-5-b.png",
  "dice-6-b.png"
];
let dice = document.querySelectorAll("img");
let playerPoint = null;
let gameInProgress = false;

function roll() {
  if (gameInProgress) {
    return; // Prevent rolling while a game is in progress
  }

  gameInProgress = true;

  dice.forEach(function (die) {
    die.classList.add("shake");
  });

  setTimeout(function () {
    dice.forEach(function (die) {
      die.classList.remove("shake");
    });

    let dieOnevalue = Math.floor(Math.random() * 6) + 1;
    let dieTwovalue = Math.floor(Math.random() * 6) + 1;
    console.log(dieOnevalue, dieTwovalue);

    document.querySelector("#dice-1").setAttribute("src", images[dieOnevalue - 1]);
    document.querySelector("#dice-2").setAttribute("src", images[dieTwovalue - 1]);

    let totalValue = dieOnevalue + dieTwovalue;
    document.querySelector("#total").innerHTML = totalValue;

    if (playerPoint === null) {
      if (totalValue === 7 || totalValue === 11) {
        document.querySelector("#currentRoll").innerHTML = "You Win!";
      } else if (totalValue === 2 || totalValue === 3 || totalValue === 12) {
        document.querySelector("#currentRoll").innerHTML = "You Lose!";
      } else {
        playerPoint = totalValue;
        document.querySelector("#currentRoll").innerHTML = "Point Set: " + playerPoint;
        document.querySelector("#playerPoint").innerHTML = "Your Point is: " + playerPoint; // Show player's point
      }
    } else {
      if (totalValue === playerPoint) {
        document.querySelector("#currentRoll").innerHTML = "You Win!";
        playerPoint = null;
      } else if (totalValue === 7) {
        document.querySelector("#currentRoll").innerHTML = "You Lose!";
        playerPoint = null;
      } else {
        document.querySelector("#currentRoll").innerHTML = "Current Roll";
      }
    }

    gameInProgress = false; // Reset game regardless of the outcome
  }, 1000);
}

function rollToHitPoint() {
  if (!gameInProgress) {
    roll();
  }
}
