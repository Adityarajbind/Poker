class SocketManager {
  constructor() {
    this.userToSocket = new Map();
    this.socketToUser = new Map();
  }

  add(socket) {
    this.userToSocket.set(
      socket.user._id.toString(),
      socket.id
    );

    this.socketToUser.set(
      socket.id,
      socket.user._id.toString()
    );
  }

  remove(socket) {
    this.userToSocket.delete(
      socket.user._id.toString()
    );

    this.socketToUser.delete(socket.id);
  }

  getSocket(userId) {
    return this.userToSocket.get(userId);
  }
}

export default new SocketManager();