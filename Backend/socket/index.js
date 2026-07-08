import roomEvents from "./roomEvents.js";
import SocketManager from "./socketManager.js";

export default function configureSocket(io) {
  io.on("connection", (socket) => {
    SocketManager.add(socket);

    roomEvents(io, socket);

    socket.on("disconnect", () => {
      SocketManager.remove(socket);
    });
  });
}
