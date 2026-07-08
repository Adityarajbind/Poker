import PokerGame from "./PokerGame.js";
import Player from "./Player.js";
import HandEvaluator from "./HandEvaluator.js";

function printPlayers(game) {
  console.log("\n===== PLAYERS =====");

  game.players.forEach((player) => {
    console.log({
      username: player.username,
      chips: player.chips,
      hand: player.hand,
      currentBet: player.currentBet,
      folded: player.folded,
      allIn: player.allIn,
    });
  });

  console.log("Pot:", game.pot);
  console.log("Current Bet:", game.currentBet);
  console.log("Current Player:", game.players[game.currentPlayer]?.username);
  console.log("Stage:", game.gameStage);
}

function printBoard(game) {
  console.log("\n===== COMMUNITY CARDS =====");
  console.table(game.communityCards);
}

console.clear();

console.log("================================");
console.log("TEST 1 - CREATE GAME");
console.log("================================");

const game = new PokerGame();

game.addPlayer(
  new Player({
    id: 1,
    username: "Alice",
  })
);

game.addPlayer(
  new Player({
    id: 2,
    username: "Bob",
  })
);

game.addPlayer(
  new Player({
    id: 3,
    username: "Charlie",
  })
);

game.addPlayer(
  new Player({
    id: 4,
    username: "Bot",
    isBot: true,
  })
);

console.log(game.players);

console.log("\n================================");
console.log("TEST 2 - START GAME");
console.log("================================");

game.startGame();

printPlayers(game);

console.log("\n================================");
console.log("TEST 3 - FLOP");
console.log("================================");

game.dealFlop();

printBoard(game);

console.log("\n================================");
console.log("TEST 4 - TURN");
console.log("================================");

game.dealTurn();

printBoard(game);

console.log("\n================================");
console.log("TEST 5 - RIVER");
console.log("================================");

game.dealRiver();

printBoard(game);

console.log("\n================================");
console.log("TEST 6 - HAND EVALUATION");
console.log("================================");

game.players.forEach((player) => {
  const result = HandEvaluator.evaluate(
    player.hand,
    game.communityCards
  );

  console.log(player.username);
  console.log(result.name);
  console.log(result.descr);
});

console.log("\n================================");
console.log("TEST 7 - WINNER");
console.log("================================");

const winners = HandEvaluator.compare(
  game.players,
  game.communityCards
);

console.log(
  winners.map((winner) => ({
    username: winner.player.username,
    hand: winner.hand.descr,
  }))
);