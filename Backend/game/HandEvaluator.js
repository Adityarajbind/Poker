import PokerSolver from "pokersolver";

const { Hand } = PokerSolver;

class HandEvaluator {
  static evaluate(playerCards, communityCards) {
    const cards = [...playerCards, ...communityCards].map((card) =>
      this.toSolverCard(card),
    );

    return Hand.solve(cards);
  }

  static compare(players, communityCards) {
    const solvedHands = players.map((player) => ({
      player,
      hand: this.evaluate(player.hand, communityCards),
    }));

    const winners = Hand.winners(solvedHands.map((p) => p.hand));

    return solvedHands.filter((p) => winners.includes(p.hand));
  }

  static toSolverCard(card) {
    const rankMap = {
      ace: "A",
      king: "K",
      queen: "Q",
      jack: "J",
    };

    const suitMap = {
      spades: "s",
      hearts: "h",
      diamonds: "d",
      clubs: "c",
    };

    const rank = rankMap[card.name] || card.name;
    const suit = suitMap[card.suit];

    return `${rank}${suit}`;
  }
}

export default HandEvaluator;