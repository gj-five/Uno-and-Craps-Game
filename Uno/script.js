const cardDeck = [];
const playedCards = [];
const cardColors = ["red", "yellow", "green", "blue"]; // reverse, p4, p2, block 
const cardSymbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

let currentTurn = 0;
let turnDirection = 1;
const playerHands = [];

function createCards() {
    for (let color of cardColors) {
        for (let i = 0; i < cardSymbols.length; i++) {
            let card = {
                color: color,
                symbol: cardSymbols[i],
            };
            if (i == 0) {
                cardDeck.push(card);
            } else {
                cardDeck.push(card);
                cardDeck.push(card);
            }
        }
    }
}
function shuffleCards() {
    cardDeck.sort(() => Math.random() - 0.5);
}
function giveCardsToPlayers() {
    for (let j = 0; j < 2; j++) { // j < 4 for 4 players
        let playerCards = [];
        for (let i = 0; i < 7; i++) {
            playerCards.push(cardDeck[0]);
            cardDeck.shift();
        }
        playerCards = organizeCards(playerCards);
        playerHands.push(playerCards);
    }
}
function organizeCards(playerCards) {
    let organizedCards = [];
    for (let color of cardColors) {
        let filteredCards = playerCards.filter((e) => e.color == color);
        organizedCards = organizedCards.concat(
            filteredCards.sort((a, b) => {
                if (a.symbol > b.symbol) return 1;
                if (a.symbol < b.symbol) return -1;
                return 0;
            })
        );
    }
    return organizedCards;
}
function startTable() {
    for (let i = 0; i < cardDeck.length; i++) {
        if (!isNaN(parseInt(cardDeck[i].symbol))) {
            playedCards.push(cardDeck[i]);
            cardDeck.splice(i, 1);
            return;
        }
    }
}
function displayDeck() {
    let deckObject = document.getElementById("deck");

    if (cardDeck.length > 0) {
        let carta = cardDeck[0];

        deckObject.innerHTML = `
        <div class="card verso">
            <div class="logo">
                UNO
            </div>
        </div>
        <div style="background-color: ${carta.color || 'black'};" class="card frente">
            <div class="logo">
                <p>${carta.symbol || ''}</p>
            </div>
        </div>
        `;
    } else {
        deckObject.innerHTML = ''; // Clear the deck if there are no cards left
    }
}

function displayTable() {
    let tableCardObject = document.getElementById("tableCard");
    let numCards = tableCardObject.children.length;
    let carta = playedCards[playedCards.length - 1];
    let angle;
    if (numCards == 0) angle = 0;
    else angle = (Math.random() - 0.5) * 2 * 15;

    tableCardObject.innerHTML += `
    <div style="background-color: ${carta.color}; transform: rotateZ(${angle}deg);" class="card">
        <div class="logo">
            <p>${carta.symbol}</p>
        </div>
    </div>
    `;
    numCards = tableCardObject.children.length;
    if (numCards == 6) tableCardObject.children[0].remove();
}
function sortCardsOnContainer() {
    let container = document.querySelector(".cards-container");
    let cards = [...container.children];

    if (playerHands[0].length == 0) return;

    let numCards = cards.length;
    let cardWidth = 110;
    let containerWidth = container.clientWidth;
    let windowWidth = window.innerWidth;
    let desiredWidth = numCards * cardWidth - 8 * (numCards - 3);

    if (desiredWidth <= windowWidth && desiredWidth <= containerWidth) return;
    let offset;
    if (desiredWidth > windowWidth) {
        offset = (cards.length * cardWidth - windowWidth) / (cards.length - 3);
    } else {
        offset = 8;
    }
    cards[0].style.marginLeft = `0px`;
    for (let i = 1; i < cards.length; i++) {
        cards[i].style.marginLeft = `-${offset}px`;
    }
}
function displayUserCards() {
    let cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";

    for (let carta of playerHands[0]) {
        let symbolHTML;
        if (carta.symbol == "reverse") symbolHTML = '<ion-icon name="refresh-outline"></ion-icon>';
        else if (carta.symbol == "block") symbolHTML = '<ion-icon name="ban-outline"></ion-icon>';
        else if (carta.symbol == "p2") symbolHTML = '+2';
        else symbolHTML = `${carta.symbol}`;

        cardsContainer.innerHTML += `
        <div style="background-color: ${carta.color};" class="card" onclick="handleClick(this)">
            <div class="logo">
                ${symbolHTML}
            </div>
        </div>
        `;
    }
    sortCardsOnContainer();
}
function displayOtherPlayers() {
    for (let numPlayer = 1; numPlayer < 2; numPlayer++) {

        let element = document.querySelector(".player-" + (numPlayer + 1));
        let logo = element.querySelector(".logo");

        if (playerHands[numPlayer].length > 0) logo.innerHTML = playerHands[numPlayer].length + "";
        else logo.innerHTML = "WINS";
    }
}
function takeCard() {
    let currentPlayer = currentTurn % 2; // %4 
    let takenCard = [];
    takenCard.push(cardDeck[0]);
    playerHands[currentPlayer].push(cardDeck[0]);
    cardDeck.shift();
    playerHands[currentPlayer] = organizeCards(playerHands[currentPlayer]);
    return takenCard[0];
}
function handleClick(cardObject) {
    if (currentTurn % 2 != 0) return; // (turn %4 != 0) 
    const cardsContainer = document.getElementById("cardsContainer");
    const myCards = [...cardsContainer.querySelectorAll(".card")];
    const indexCard = myCards.findIndex(card => card == cardObject)
    let selectedCard = playerHands[0][indexCard];
    if (!isValidCard(selectedCard)) return;
    playedCards.push(selectedCard);
    playerHands[0].splice(indexCard, 1);
    myCards[indexCard].remove();
    sortCardsOnContainer();
    displayTable();
    myCards.forEach(card => card.classList.remove("my-turn"));
    handlePowerUps(selectedCard);
}
function isValidCard(card) {
    let tableCard = playedCards[playedCards.length - 1];
    if (card.symbol == tableCard.symbol ||
        card.color == tableCard.color ||
        card.color == "black") return true;
    return false;
}
function handleTurn() {
    // console.log(deck.length);
    for (let i = 0; i < playerHands.length; i++) {
        let player = playerHands[i];
        if (player.length == 0) {
            let gameStatus = document.getElementById("gameStatus");
            let winBox = document.getElementById("winBox");

            if (i != 0) {
                // console.log(`Player ${i + 1} WINS!!`);
                document.querySelector(".player-" + (i + 1)).classList.add("winner");
                winBox.querySelector("p").textContent = `Player ${i + 1} WINS!!`; // Update win box text
            } else {
                // console.log("You won the game!"); // Message for the current player
                winBox.querySelector("p").textContent = "You won the game!"; // Update win box text
            }
            winBox.style.display = "block"; // Show the win box
            return;
        }
    }
    for (let i = 1; i < 3; i++) {
        let turnOfObj = document.querySelector(".player-" + (i + 1));
        if (i == currentTurn % 2) {
            turnOfObj.classList.add("turnOf");
        } else {
            turnOfObj.classList.remove("turnOf");
        }
    }
    let validCards = 0;
    playerHands[currentTurn % 2].forEach(card => {
        if (isValidCard(card)) validCards++;
    });
    // if there are NOT valid cards to play 
    if (validCards == 0) {
        takeCardActions();
        return;
    }
    // if there are valid cards to play 
    placeCardActions();
}
function takeCardActions() {
    currentPlayer = currentTurn % 2; // currentPlayer = turn % 4;
    if (currentPlayer == 0) {
        // console.log("You have not cards to place");
        let deckObject = document.getElementById("deck");
        deckObject.classList.add("my-time");
        displayDeck();
    } else {
        setTimeout(() => {
            // console.log(`Player ${currentPlayer + 1} is taking a card`);
            let takenCard = takeCard();
            if (!isValidCard(takenCard)) {
                setTimeout(() => {
                    displayOtherPlayers();
                    // console.log(`Player ${currentPlayer + 1} has not cards to place`);
                    currentTurn += turnDirection;
                    handleTurn();
                    return;
                }, 1500)
            } else {
                setTimeout(() => {
                    displayOtherPlayers();
                    placeCardActions();
                }, 1200);
            }
        }, 1000);
    }
}
function turnDeckCard(deckObject) {
    if (!deckObject.classList.contains("my-time")) return;
    deckObject.classList.toggle("turned");
    let takenCard = takeCard();
    if (!isValidCard(takenCard)) {
        // console.log("Can not place this card");
        setTimeout(() => {
            deckObject.classList.toggle("turned");
            displayUserCards();
            currentTurn += turnDirection;
            handleTurn();
        }, 1200);
    } else {
        // console.log("Placing card");
        setTimeout(() => {
            deckObject.classList.toggle("turned");
            let indexCard = playerHands[0].findIndex(card => card == takenCard);
            playedCards.push(takenCard);
            playerHands[0].splice(indexCard, 1);
            displayTable();
            handlePowerUps(takenCard);
        }, 1200)
    }
    deckObject.classList.remove("my-time");
}
function placeCardActions() {
    let currentPlayer = currentTurn % 2;
    if (currentPlayer == 0) {
        // console.log("It's your time!");
        let cardsObject = [...document.querySelector(".cards-container").children];
        let cardsInfo = playerHands[0];

        if (cardsObject.length != cardsInfo.length) console.log("SOMETHING WENT WRONG!");

        for (let i = 0; i < cardsInfo.length; i++) {
            if (isValidCard(cardsInfo[i])) cardsObject[i].classList.add("my-turn");
        }
    } else {
        // logic for the other players...
        // console.log(`Player ${currentPlayer + 1} is thinking`);
        let validCards = playerHands[currentPlayer].filter(card => isValidCard(card));

        let jokers = validCards.filter(validCard => validCard.color == "black");
        let noJokers = validCards.filter(validCard => validCard.color != "black");

        let selectedCard;
        if (noJokers.length > 0) {
            noJokers = noJokers.sort((a, b) => {
                if (a.symbol > b.symbol) return 1;
                if (a.symbol < b.symbol) return -1;
                return 0;
            });
            selectedCard = noJokers[noJokers.length - 1];
        } else if (jokers.length > 0) {
            selectedCard = jokers[0];
        } else {
            // console.log("SOMETHING WENT WRONG!!")
        }

        let index = playerHands[currentPlayer].findIndex(card => card == selectedCard);

        playedCards.push(selectedCard);
        playerHands[currentPlayer].splice(index, 1);

        setTimeout(() => {
            displayTable();
            displayOtherPlayers();
            handlePowerUps(selectedCard);
        }, 3000);
    }
}
function handlePowerUps(selectedCard) {
    if (!isNaN(parseInt(selectedCard.symbol))) {
        currentTurn += turnDirection;
        handleTurn();
        return;
    }
}
createCards();
shuffleCards();
giveCardsToPlayers();
startTable();
displayTable();
displayUserCards();
displayOtherPlayers();
displayDeck();
handleTurn();