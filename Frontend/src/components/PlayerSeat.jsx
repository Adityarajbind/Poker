import Card from "./Card";
import { Bot } from "lucide-react";
import TurnTimer from "./TurnTimer";

// Standard offsets to simulate cards dealing from the absolute center of the table
const getSeatOffset = (seatIndex) => {
  const offsets = [
    { x: 0, y: -180 }, // Seat 0 (Bottom Center)
    { x: 0, y: 180 }, // Seat 1 (Top Center)
    { x: -350, y: 100 }, // Seat 2 (Top Right)
    { x: 350, y: 100 }, // Seat 3 (Top Left)
    { x: 350, y: -100 }, // Seat 4 (Bottom Left)
    { x: -350, y: -100 }, // Seat 5 (Bottom Right)
  ];
  return offsets[seatIndex] || { x: 0, y: 0 };
};

const PlayerSeat = ({
  player,
  isDealer,
  isCurrentPlayer,
  hideCards,
  animateDeal,
  seatIndex = 0,
  turnStartedAt,
  turnDuration,
}) => {
  return (
    <div className="w-full flex justify-center">
      {isDealer && (
        <div className="dealer absolute w-4 h-4 -top-1.5 -left-1.5 z-99">
          <img src="/chip.png" alt="Dealer Button" />
        </div>
      )}
      <div
        className={`rounded-sm border border-zinc-700 text-white w-fit min-w-25 z-30 px-2 relative ${
          isCurrentPlayer ? "bg-purple-900" : "bg-zinc-900"
        }`}
      >
        <h3 className="font-semibold flex text-xs justify-between w-full mr-4">
          {player.username}
          {player.isBot && <Bot size={14} />}
        </h3>
        <span className="text-[14px] ">$ {player.chips}</span>
      </div>
      <div className="absolute bottom-0 z-999"><TurnTimer active={isCurrentPlayer} startedAt={turnStartedAt} /></div>
      <div className="flex gap-1 absolute -top-3/4 z-10">
        {player.hand.map((card, index) => (
          <Card
            key={index}
            name={card.name}
            suit={card.suit}
            flipped={hideCards}
            animateDeal={animateDeal}
            delay={animateDeal ? (seatIndex * 2 + index) * 0.12 : 0}
            startOffset={getSeatOffset(seatIndex)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerSeat;
