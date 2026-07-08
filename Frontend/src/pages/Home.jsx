import { useContext, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Bot, ArrowRight, Copy } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const handleCreateRoom = async () => {
    try {
      const { data } = await API.post("/rooms/create");
      setRoomCode(data.roomCode);
      navigate(`/room/${data.roomCode}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };
  const handleJoinRoom = async () => {
    if (roomCode.length !== 6) return;

    try {
      await API.post("/rooms/join", {
        roomCode,
      });

      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-orange-500/15 blur-[170px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-600/10 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-8 py-14">
        {/* Hero */}

        <div className="mb-12">
          <p className="text-orange-400 font-semibold tracking-[0.35em] uppercase">
            Poker Practice
          </p>

          <h1 className="mt-3 text-6xl font-black">
            Master
            <span className="text-orange-400"> Texas Hold'em</span>
          </h1>

          <p className="mt-6 max-w-2xl text-zinc-400 text-lg">
            Play completely free with your friends or intelligent bots. Practice
            strategies, improve your game and enjoy multiplayer poker without
            risking real money.
          </p>
        </div>

        {/* Bento */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Create */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <Plus className="text-orange-400" />
            </div>

            <h2 className="text-3xl font-bold">Create Room</h2>

            <p className="mt-3 text-zinc-400">
              Create a private poker lobby and invite your friends.
            </p>

            <button
              onClick={handleCreateRoom}
              className="mt-10 w-full rounded-2xl bg-orange-500 py-4 font-semibold transition hover:bg-orange-400"
            >
              Create Room
            </button>
          </div>

          {/* Join */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <Users className="text-orange-400" />
            </div>

            <h2 className="text-3xl font-bold">Join Room</h2>

            <p className="mt-3 text-zinc-400">Enter your friend's room code.</p>

            <input
              maxLength={6}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE"
              className="mt-8 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-center text-xl font-bold tracking-[0.4em] uppercase outline-none transition focus:border-orange-500"
            />

            <button
              onClick={handleJoinRoom}
              className="mt-4 w-full rounded-2xl border border-orange-500 bg-orange-500/10 py-4 font-semibold text-orange-400 transition hover:bg-orange-500 hover:text-white"
            >
              Join Room
            </button>
          </div>

          {/* Bots */}

          <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 to-white/5 p-8 backdrop-blur-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">
              <Bot className="text-orange-400" />
            </div>

            <h2 className="text-3xl font-bold">Practice</h2>

            <p className="mt-3 text-zinc-400">
              Start instantly against AI bots. Perfect for practicing openings,
              bluffing and late-game decisions.
            </p>

            <button className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-semibold transition hover:bg-orange-400">
              Play Now
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
