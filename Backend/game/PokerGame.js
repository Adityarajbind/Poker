import Deck from "./Deck.js";
import HandEvaluator from "./HandEvaluator.js";
class PokerGame {
  constructor() {
    this.players = [];
    this.currentBet = 0; // Highest bet this round
    this.lastRaiser = null; // Player who last raised
    this.deck = null;

    this.communityCards = [];

    this.pot = 0;

    this.currentPlayer = 0;

    this.dealerIndex = 0;

    this.smallBlind = 10;
    this.bigBlind = 20;

    this.gameStage = "waiting";
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(id) {
    this.players = this.players.filter((player) => player.id !== id);
  }

  startGame() {
    if (this.players.length < 2) {
      throw new Error("At least 2 players are required.");
    }

    // Fresh deck
    this.deck = new Deck();
    this.deck.shuffle();

    // Reset game state
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.lastRaiser = null;
    this.gameStage = "preflop";

    // Reset every player
    this.players.forEach((player) => player.resetForNewHand());

    // Deal two cards
    this.dealHoleCards();

    // Post blinds
    this.postSmallBlind();
    this.postBigBlind();

    // Set first player to act
    this.setFirstPlayer();
  }
  rotateDealer() {
    this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
  }
  dealHoleCards() {
    for (let i = 0; i < 2; i++) {
      for (const player of this.players) {
        player.receiveCard(this.deck.draw());
      }
    }
  }
  findNextActivePlayer(startIndex) {
    let index = startIndex;

    do {
      index = (index + 1) % this.players.length;

      const player = this.players[index];

      if (!player.folded && !player.allIn && player.chips > 0) {
        return index;
      }
    } while (index !== startIndex);

    return -1;
  }
  setFirstPlayerAfterDealer() {
    let index = this.dealerIndex;

    do {
      index = (index + 1) % this.players.length;

      const player = this.players[index];

      if (!player.folded && !player.allIn && player.chips > 0) {
        this.currentPlayer = index;
        return;
      }
    } while (index !== this.dealerIndex);
  }
  dealFlop() {
    this.deck.draw(); // Burn card

    this.communityCards.push(
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw(),
    );

    this.gameStage = "flop";
  }

  dealTurn() {
    this.deck.draw(); // Burn

    this.communityCards.push(this.deck.draw());

    this.gameStage = "turn";
  }

  dealRiver() {
    this.deck.draw(); // Burn

    this.communityCards.push(this.deck.draw());

    this.gameStage = "river";
  }

  postSmallBlind() {
    const index = (this.dealerIndex + 1) % this.players.length;

    const player = this.players[index];

    const blind = Math.min(player.chips, this.smallBlind);

    player.chips -= blind;
    player.currentBet += blind;

    this.pot += blind;
  }
  postBigBlind() {
    const index = (this.dealerIndex + 2) % this.players.length;

    const player = this.players[index];

    const blind = Math.min(player.chips, this.bigBlind);

    player.chips -= blind;
    player.currentBet += blind;

    this.pot += blind;

    this.currentBet = blind;
  }
  setFirstPlayer() {
    this.currentPlayer = (this.dealerIndex + 3) % this.players.length;
  }
  getActivePlayers() {
    return this.players.filter((player) => !player.folded && player.chips >= 0);
  }
  isHandOver() {
    return this.getActivePlayers().length === 1;
  }
  awardPotToWinner() {
    const winner = this.getActivePlayers()[0];

    winner.chips += this.pot;

    this.winners = [
      {
        username: winner.username,
        hand: "Fold",
      },
    ];

    this.pot = 0;

    this.gameStage = "finished";
  }
  nextPlayer() {
    const next = this.findNextActivePlayer(this.currentPlayer);

    if (next !== -1) {
      this.currentPlayer = next;
    }
  }
  finishPlayerAction() {
    if (this.isHandOver()) {
      this.awardPotToWinner();
      return;
    }

    if (this.isBettingRoundOver()) {
      this.advanceStage();
    } else {
      this.nextPlayer();
    }
  }
  fold() {
    const player = this.players[this.currentPlayer];

    player.folded = true;
    player.hasActed = true;
    this.finishPlayerAction();
  }
  check() {
    const player = this.players[this.currentPlayer];

    if (player.currentBet !== this.currentBet) {
      throw new Error("Cannot check.");
    }

    player.hasActed = true;
    this.finishPlayerAction();
  }
  call() {
    const player = this.players[this.currentPlayer];

    const amountToCall = this.currentBet - player.currentBet;

    const payment = Math.min(amountToCall, player.chips);

    player.chips -= payment;
    player.currentBet += payment;

    this.pot += payment;

    if (player.chips === 0) {
      player.allIn = true;
    }

    player.hasActed = true;
    this.finishPlayerAction();
  }
  bet(amount) {
    const player = this.players[this.currentPlayer];

    if (this.currentBet !== 0) {
      throw new Error("Use raise instead.");
    }

    const amountToBet = Math.min(amount, player.chips);

    player.chips -= amountToBet;
    player.currentBet = amount;

    this.pot += amount;

    this.currentBet = amount;
    this.lastRaiser = this.currentPlayer;

    if (player.chips === 0) {
      player.allIn = true;
    }

    player.hasActed = true;
    this.finishPlayerAction();
  }
  raise(amount) {
    const player = this.players[this.currentPlayer];

    const totalBet = this.currentBet + amount;

    const payment = totalBet - player.currentBet;

    player.chips -= payment;
    player.currentBet = totalBet;

    this.pot += payment;

    this.currentBet = totalBet;
    this.lastRaiser = this.currentPlayer;

    if (player.chips === 0) {
      player.allIn = true;
    }

    player.hasActed = true;
    this.finishPlayerAction();
  }
  allIn() {
    const player = this.players[this.currentPlayer];

    const amount = player.chips;

    player.currentBet += amount;
    this.pot += amount;

    player.chips = 0;
    player.allIn = true;

    if (player.currentBet > this.currentBet) {
      this.currentBet = player.currentBet;
      this.lastRaiser = this.currentPlayer;
    }

    player.hasActed = true;
    this.finishPlayerAction();
  }

  resetBettingRound() {
    this.currentBet = 0;
    this.lastRaiser = null;

    this.players.forEach((player) => {
      player.currentBet = 0;
      player.hasActed = false;
    });
  }
  isBettingRoundOver() {
    const activePlayers = this.players.filter(
      (player) => !player.folded && !player.allIn,
    );

    return activePlayers.every(
      (player) => player.hasActed && player.currentBet === this.currentBet,
    );
  }
  advanceStage() {
    switch (this.gameStage) {
      case "preflop":
        this.dealFlop();
        break;

      case "flop":
        this.dealTurn();
        break;

      case "turn":
        this.dealRiver();
        break;

      case "river":
        this.showdown();
        return;
    }

    this.resetBettingRound();

    // First player after the dealer acts first
    this.setFirstPlayerAfterDealer();
  }
  showdown() {
    const activePlayers = this.players.filter((p) => !p.folded);

    const winners = HandEvaluator.compare(activePlayers, this.communityCards);

    const share = Math.floor(this.pot / winners.length);

    winners.forEach((winner) => {
      winner.player.chips += share;
    });

    this.pot = 0;

    this.gameStage = "finished";

    this.winners = winners.map((w) => ({
      username: w.player.username,
      hand: w.hand.name,
    }));

    return winners;
  }
  startNextHand() {
    // Remove busted players
    this.players = this.players.filter((player) => player.chips > 0);

    // Game cannot continue
    if (this.players.length < 2) {
      this.gameStage = "gameover";
      return;
    }

    // Move dealer button
    this.rotateDealer();

    // Start a fresh hand
    this.startGame();
  }
}

export default PokerGame;
