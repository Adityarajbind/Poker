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

  if (!room) return <div>Loading...</div>;

  return (
    <div>
      <h1>{room.roomCode}</h1>

      {room.players.map((player) => (
        <div
          key={player.user}
          className="flex justify-between border p-3 rounded"
        >
          <span>{player.username}</span>

          <span>{player.ready ? "🟢 Ready" : "⚪ Not Ready"}</span>
          <button
  onClick={leaveRoom}
  className="bg-red-600 px-4 py-2 rounded-lg"
>
  Leave Room
</button>
        </div>
        
      ))}
    </div>
  );
};

export default Room;
