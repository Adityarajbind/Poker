import { useEffect, useState } from "react";
import { LogOut, Ban, Check, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
const Room = () => {
  const { userId } = useAuth();

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
    <div className="bg-neutral-800 min-h-screen w-full text-white">
      <div className="flex justify-between p-2">
        <h1 className="flex items-center px-3 py-3 text-2xl rounded-lg bg-neutral-600 font-bold">
          CODE : {room.roomCode}
        </h1>

        {room.host === userId && (
          <button
            onClick={addBot}
            className="bg-orange-500 border border-orange-600 px-4 py-2 rounded-lg"
          >
            Add Bot
          </button>
        )}
      </div>
      {room.players.map((player) => {
        const isMe = player.user === userId;

        return (
          <div
            key={player.user}
            className="flex justify-between items-center bg-neutral-600 py-4 px-2 rounded m-2 mt-0"
          >
            <div className="flex items-center gap-2 text-[1.2rem] font-bold ">
              <span>{player.username}</span>

              {player.isBot && (
                <span className="text-xs bg-orange-500 px-2 py-1 rounded">
                  BOT
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!player.isBot && (
                <span>{player.ready ? "🟢 Ready" : "⚪ Not Ready"}</span>
              )}

              {/* Only my ready button */}
              {isMe && !player.isBot && (
                <button
                  onClick={toggleReady}
                  className={`p-1 rounded-md ${
                    player.ready ? "bg-red-400" : "bg-green-400"
                  }`}
                >
                  {player.ready ? <X size={22} /> : <Check size={22} />}
                </button>
              )}

              {/* Only my leave button */}
              {isMe && !player.isBot && (
                <button
                  onClick={leaveRoom}
                  className="bg-blue-400 p-1 rounded-md"
                >
                  <LogOut size={22} />
                </button>
              )}

              {/* Only host can remove bots */}
              {player.isBot && room.host === userId && (
                <button
                  onClick={removeBot}
                  className="bg-red-300 p-1 rounded-md"
                >
                  <Ban size={22} color="#870d0d" />
                </button>
              )}
            </div>
          </div>
        );
      })}
      {room.host === userId && (
        <button
          onClick={startGame}
          className="cursor-pointer bg-green-600 mx-2 py-4 px-4 text-2xl font-extrabold rounded-sm absolute left-1/2 -translate-x-1/2"
        >
          START GAME
        </button>
      )}
    </div>
  );
};

export default Room;
