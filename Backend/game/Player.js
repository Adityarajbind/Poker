class Player {
  constructor({
    id,
    username,
    chips = 1000,
    isBot = false,
  }) {
    this.id = id;
    this.username = username;
    this.chips = chips;
    this.isBot = isBot;

    // Hand
    this.hand = [];

    // Betting
    this.currentBet = 0;
    this.hasActed = false;

    // State
    this.folded = false;
    this.allIn = false;
  }

  receiveCard(card) {
    this.hand.push(card);
  }

  clearHand() {
    this.hand = [];
  }

  resetForNewRound() {
    this.currentBet = 0;
    this.hasActed = false;
  }

  resetForNewHand() {
    this.hand = [];
    this.currentBet = 0;
    this.hasActed = false;
    this.folded = false;
    this.allIn = false;
  }
}

export default Player;