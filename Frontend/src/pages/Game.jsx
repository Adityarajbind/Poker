import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import PokerTable from "../components/PokerTable";
import PlayerSeat from "../components/PlayerSeat";
import ActionBar from "../components/ActionBar";

const Game = () => {
  const { userId } = useAuth();
  const [showWinner, setShowWinner] = useState(false);
  const { roomCode } = useParams();
  const socket = useSocket();

  const [game, setGame] = useState(null);
  useEffect(() => {
    socket.emit("get-game-state", { roomCode });

    socket.on("game-state", (state) => {
      console.log("Received state", state);
      setGame(state);

      if (state.gameStage === "finished") {
        setShowWinner(true);

        setTimeout(() => {
          setShowWinner(false);
        }, 2000);
      }
    });
    return () => {
      socket.off("game-state");
    };
  }, []);

  useEffect(() => {
    socket.on("action-error", (message) => {
      alert(message);
    });

    return () => {
      socket.off("action-error");
    };
  }, []);
  const playerAction = (action, amount = 0) => {
    socket.emit("player-action", {
      roomCode,
      action,
      amount,
    });
  };
  if (!game) return null;

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center gap-8">
      {showWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-3xl bg-zinc-900 border border-orange-500 p-10">
            <h1 className="text-4xl font-bold text-orange-400">Winner</h1>

            {game.winners.map((winner) => (
              <div key={winner.username} className="mt-4 text-center">
                <div className="text-2xl">{winner.username}</div>

                <div className="text-zinc-400">{winner.hand}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mb-12 w-full flex justify-center">
              <PokerTable game={game} myId={userId} />
      </div>

<ActionBar
  actions={game.availableActions}
  player={game.players[game.currentPlayer]}
  fold={() => playerAction("fold")}
  check={() => playerAction("check")}
  call={() => playerAction("call")}
  raise={(amount) => playerAction("raise", amount)}
  bet={(amount) => playerAction("bet", amount)}
  allIn={() => playerAction("allin")}
/>
    </div>
  );
};

export default Game;
