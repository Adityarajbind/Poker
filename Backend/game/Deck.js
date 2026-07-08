// Deck.js

const RANKS = [
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "5", value: 5 },
  { name: "6", value: 6 },
  { name: "7", value: 7 },
  { name: "8", value: 8 },
  { name: "9", value: 9 },
  { name: "10", value: 10 },
  { name: "jack", value: 11 },
  { name: "queen", value: 12 },
  { name: "king", value: 13 },
  { name: "ace", value: 14 },
];

const SUITS = ["spades", "hearts", "diamonds", "clubs"];

class Deck {
  constructor() {
    this.cards = [];
    this.createDeck();
  }

  createDeck() {
    this.cards = [];

    for (const suit of SUITS) {
      for (const rank of RANKS) {
        this.cards.push({
          name: rank.name,
          value: rank.value,
          suit,
        });
      }
    }
  }
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  draw() {
  return this.cards.pop();
}
}

export default Deck;
