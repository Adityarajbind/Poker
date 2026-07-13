import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const Room = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [room, setRoom] = useState(null);

  useEffect(() => {
    socket.emit("join-room", { roomCode });

    socket.on("room-state", (roomData) => {
      setRoom(roomData);
    });
    socket.on("game-started", () => {
      navigate(`/game/${roomCode}`);
    });
    return () => {
      socket.off("room-state");
    };
  }, []);
  const toggleReady = () => {
    socket.emit("toggle-ready", {
      roomCode,
    });
  };
  const leaveRoom = () => {
    socket.emit("leave-room", {
      roomCode,
    });

    navigate("/");
  };
  const addBot = () => {
    socket.emit("add-bot", {
      roomCode,
    });
  };
  const removeBot = () => {
    socket.emit("remove-bot", {
      roomCode,
    });
  };
  const startGame = () => {
    socket.emit("start-game", {
      roomCode,
    });
  };
  if (!room) return <div>Loading...</div>;

  return (
    <div>
      <h1>{room.roomCode}</h1>
      <button onClick={addBot} className="bg-orange-500 px-4 py-2 rounded-lg">
        Add Bot
      </button>
      {room.players.map((player) => (
        <div
          key={player.user}
          className="flex justify-between border p-3 rounded"
        >
          <div className="flex items-center gap-2">
            <span>{player.username}</span>

            {player.isBot && (
              <span className="text-xs bg-orange-500 px-2 py-1 rounded">
                BOT
              </span>
            )}
          </div>
          <span>{player.ready ? "🟢 Ready" : "⚪ Not Ready"}</span>
          {player.isBot ? (
            <button
              onClick={removeBot}
              className="bg-red-300 px-4 py-2 rounded-lg"
            >
              Remove Bot
            </button>
          ) : (
            <button
              onClick={leaveRoom}
              className="bg-red-600 px-4 py-2 rounded-lg"
            >
              Leave Room
            </button>
          )}
          <button
            onClick={toggleReady}
            className="bg-yellow-200 px-4 py-2 rounded-lg"
          >
            ready Nigga ?
          </button>
        </div>
      ))}
      <button onClick={startGame} className="cursor-pointer bg-green-600 px-4 py-2 rounded-lg">
        Start Game
      </button>
    </div>
  );
};

export default Room;
