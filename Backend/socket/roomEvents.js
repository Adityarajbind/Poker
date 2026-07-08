import Room from "../models/Room.js";

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
    (player) => player.user.toString() !== socket.user._id.toString()
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
}
