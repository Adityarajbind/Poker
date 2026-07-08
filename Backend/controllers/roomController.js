import Room from "../models/Room.js";

function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}


export const createRoom = async (req, res) => {
  try {
    let roomCode;

    while (true) {
      roomCode = generateRoomCode();

      const exists = await Room.findOne({ roomCode });

      if (!exists) break;
    }

    const room = await Room.create({
      roomCode,

      host: req.user.id,

      players: [
        {
          user: req.user.id,
          username: req.user.username,
          ready: true,
        },
      ],
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({
        message: "Room is full",
      });
    }

    const alreadyJoined = room.players.some(
      (player) => player.user.toString() === req.user.id
    );

    if (alreadyJoined) {
      return res.json(room);
    }

    room.players.push({
      user: req.user.id,
      username: req.user.username,
    });

    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomCode: req.params.code.toUpperCase(),
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const leaveRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    room.players = room.players.filter(
      (player) =>
        player.user?.toString() !== req.user._id.toString()
    );

    // Host left
    if (room.host.toString() === req.user._id.toString()) {
      if (room.players.length === 0) {
        await room.deleteOne();

        return res.json({
          message: "Room deleted",
        });
      }

      room.host = room.players[0].user;
    }

    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const toggleReady = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const player = room.players.find(
      (player) =>
        player.user?.toString() === req.user._id.toString()
    );

    if (!player) {
      return res.status(404).json({
        message: "Player not in room",
      });
    }

    player.ready = !player.ready;

    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const addBot = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only host can add bots",
      });
    }

    room.players.push({
      username: `Bot ${room.players.length}`,
      isBot: true,
      ready: true,
      chips: 1000,
      seat: room.players.length,
    });

    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const startRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only host can start the game",
      });
    }

    if (room.players.length < 2) {
      return res.status(400).json({
        message: "At least 2 players required",
      });
    }

    const everyoneReady = room.players.every(
      (player) => player.ready
    );

    if (!everyoneReady) {
      return res.status(400).json({
        message: "All players must be ready",
      });
    }

    room.status = "playing";

    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};