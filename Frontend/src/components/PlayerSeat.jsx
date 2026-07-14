import Card from "./Card";
import { Bot } from "lucide-react";
const PlayerSeat = ({ player, isDealer, isCurrentPlayer, hideCards }) => {
  console.log(isDealer);
  return (
    <div className="w-full flex justify-center">
      {isDealer && (
        <div className="dealer absolute w-4 h-4 -top-1.5 -left-1.5 z-99">
          <img src="/chip.png" alt="" />
        </div>
      )}
      <div
        className={`rounded-sm border  border-zinc-700 text-white w-fit min-w-25 z-30 px-2 relative ${isCurrentPlayer ? "bg-purple-900" : "bg-zinc-900"}`}
      >
        <h3 className="font-semibold flex text-xs justify-between w-full mr-4">
          {player.username}
          {player.isBot && <Bot size={14} />}
        </h3>

        <span className="text-[14px] ">$ {player.chips}</span>
      </div>

      <div className="flex gap-1 absolute -top-3/4 z-10">
        {player.hand.map((card, index) => (
          <Card
            key={index}
            name={card.name}
            suit={card.suit}
            flipped={hideCards}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerSeat;
