import Card from "./Card";

const PlayerSeat = ({ player, isCurrentPlayer }) => {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-3 min-w-[170px]">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          {player.username}
          {player.isBot && (
            <span className="ml-2 text-xs text-orange-400">
              BOT
            </span>
          )}
        </h3>

        <span>{player.chips}</span>
      </div>

      <div className="flex gap-2 mt-3">
        {player.hand.map((card, index) => (
          <Card
            key={index}
            name={card.name}
            suit={card.suit}
          />
        ))}
      </div>

      {isCurrentPlayer && (
        <div className="mt-3 text-green-400 font-bold">
          Your Turn
        </div>
      )}
    </div>
  );
};

export default PlayerSeat;