import PokerGame from "./PokerGame.js";

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomCode) {
    if (this.rooms.has(roomCode)) {
      throw new Error("Room already exists");
    }

    const game = new PokerGame();

    this.rooms.set(roomCode, game);

    return game;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  deleteRoom(roomCode) {
    this.rooms.delete(roomCode);
  }

  hasRoom(roomCode) {
    return this.rooms.has(roomCode);
  }

  getAllRooms() {
    return [...this.rooms.keys()];
  }
}

export default new RoomManager();