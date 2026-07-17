import Room from "../models/Room.js";
import BOT_NAMES from "../game/BotNames.js";
import mongoose from "mongoose";
import RoomManager from "../game/RoomManager.js";
import Player from "../game/Player.js";
function playBotTurn(io, roomCode, game) {
  while (true) {
    if (game.gameStage === "finished" || game.gameStage === "gameover") {
      break;
    }

    const player = game.players[game.currentPlayer];

    if (!player.isBot) break;

    if (player.currentBet < game.currentBet) {
      game.call();
    } else {
      game.check();
    }

    emitGameState(io.to(roomCode), game);
  }

  if (game.gameStage === "finished") {
    setTimeout(() => {
      game.startNextHand();
      io.to(roomCode).emit("game-started");

      emitGameState(io.to(roomCode), game);

      playBotTurn(io, roomCode, game);
    }, 2000);
  }
}

function emitGameState(target, game) {
  const current = game.players[game.currentPlayer];

  const availableActions = [];

  if (current) {
    availableActions.push("fold");

    if (current.currentBet === game.currentBet) {
      availableActions.push("check");

      if (current.chips > 0) {
        availableActions.push("bet");
      }
    } else {
      availableActions.push("call");

      if (current.chips > game.currentBet - current.currentBet) {
        availableActions.push("raise");
      }
    }

    if (current.chips > 0) {
      availableActions.push("allin");
    }
  }
  target.emit("game-state", {
    pot: game.pot,
    dealerIndex: game.dealerIndex,
    currentPlayer: game.currentPlayer,
    currentPlayerId: game.players[game.currentPlayer]?.id,
    currentBet: game.currentBet,
    gameStage: game.gameStage,
    communityCards: game.communityCards,
    winner: game.winner,
    winningHand: game.winningHand,
    winners: game.winners ?? [],
    availableActions: availableActions,
    players: game.players.map((player) => ({
      id: player.id,
      username: player.username,
      chips: player.chips,
      hand: player.hand,
      folded: player.folded,
      allIn: player.allIn,
      currentBet: player.currentBet,
      isBot: player.isBot,
    })),
  });
}
export default function roomEvents(io, socket) {
  socket.on("join-room", async ({ roomCode }) => {
    const room = await Room.findOne({ roomCode });

    if (!room) {
      socket.emit("error", {
        message: "Room not found",
      });
      return;
    }

    socket.join(roomCode);

    io.to(roomCode).emit("room-state", room);
  });
  socket.on("toggle-ready", async ({ roomCode }) => {
    const room = await Room.findOne({ roomCode });

    if (!room) return;

    const player = room.players.find(
      (p) => p.user.toString() === socket.user._id.toString(),
    );

    if (!player) return;

    player.ready = !player.ready;

    await room.save();

    io.to(roomCode).emit("room-state", room);
  });
  socket.on("leave-room", async ({ roomCode }) => {
    const room = await Room.findOne({ roomCode });

    if (!room) return;

    room.players = room.players.filter(
      (player) => player.user.toString() !== socket.user._id.toString(),
    );

    socket.leave(roomCode);

    // Delete room if empty
    if (room.players.length === 0) {
      await Room.deleteOne({ _id: room._id });
      return;
    }

    await room.save();

    io.to(roomCode).emit("room-state", room);
  });
  socket.on("add-bot", async ({ roomCode }) => {
    const room = await Room.findOne({ roomCode });

    if (!room) return;

    // Only host can add bots
    if (room.host.toString() !== socket.user._id.toString()) {
      return;
    }

    // Maximum 6 players
    if (room.players.length >= 6) {
      return;
    }

    const usedNames = room.players.map((p) => p.username);

    const available = BOT_NAMES.filter((name) => !usedNames.includes(name));

    if (available.length === 0) return;

    const botName = available[Math.floor(Math.random() * available.length)];

    room.players.push({
      user: new mongoose.Types.ObjectId(),
      username: botName,
      ready: true,
      isBot: true,
    });

    await room.save();

    io.to(roomCode).emit("room-state", room);
  });
  socket.on("remove-bot", async ({ roomCode }) => {
    const room = await Room.findOne({ roomCode });

    if (!room) return;

    // Only host can remove bots
    if (room.host.toString() !== socket.user._id.toString()) {
      return;
    }

    // Find the last bot in the room
    const botIndex = room.players
      .map((player) => player.isBot)
      .lastIndexOf(true);

    if (botIndex === -1) {
      return; // No bots to remove
    }

    room.players.splice(botIndex, 1);

    await room.save();

    io.to(roomCode).emit("room-state", room);
  });
  socket.on("start-game", async ({ roomCode }) => {
    const room = await Room.findOne({ roomCode });

    if (!room) return;

    // Only the host can start the game
    if (room.host.toString() !== socket.user._id.toString()) {
      return;
    }

    // At least 2 players
    if (room.players.length < 2) {
      return;
    }

    // Make sure all human players are ready
    const everyoneReady = room.players.every(
      (player) => player.isBot || player.ready,
    );

    if (!everyoneReady) {
      return;
    }

    if (RoomManager.hasRoom(roomCode)) {
      RoomManager.deleteRoom(roomCode);
    }

    const game = RoomManager.createRoom(roomCode);

    room.players.forEach((player) => {
      game.addPlayer(
        new Player({
          id: player.user.toString(),
          username: player.username,
          chips: 1000,
          isBot: player.isBot,
        }),
      );
    });

    game.startGame();

    emitGameState(io.to(roomCode), game);

    playBotTurn(io, roomCode, game);

    io.to(roomCode).emit("game-started");
  });
  socket.on("get-game-state", ({ roomCode }) => {
    const game = RoomManager.getRoom(roomCode);

    if (!game) return;

    emitGameState(socket, game);
  });
  socket.on("player-action", ({ roomCode, action, amount }) => {
    const game = RoomManager.getRoom(roomCode);

    if (!game) return;
    if (game.gameStage === "finished" || game.gameStage === "gameover") {
      return;
    }
    const currentPlayer = game.players[game.currentPlayer];

    if (
      !currentPlayer.isBot &&
      currentPlayer.id !== socket.user._id.toString()
    ) {
      return;
    }
    try {
      switch (action) {
        case "fold":
          game.fold();
          break;

        case "check":
          game.check();
          break;

        case "call":
          game.call();
          break;

        case "bet":
          game.bet(amount);
          break;

        case "raise":
          game.raise(amount);
          break;

        case "allin":
          game.allIn();
          break;

        default:
          return;
      }
      console.log(
        "Broadcasting",
        action,
        "Current player:",
        game.currentPlayer,
        "Stage:",
        game.gameStage,
      );

      emitGameState(io.to(roomCode), game);

      playBotTurn(io, roomCode, game);
    } catch (err) {
      socket.emit("action-error", err.message);
    }
  });
}
