import Card from "./Card";

const PokerTable = ({ game }) => {
  return (
    <div className="bg-green-800 rounded-full w-[900px] h-[420px] border-[10px] border-zinc-700 flex flex-col justify-center items-center">

      <h2 className="text-white text-3xl font-bold">
        Pot
      </h2>

      <p className="text-orange-400 text-2xl mb-8">
        {game.pot}
      </p>

      <div className="flex gap-2">
        {game.communityCards.map((card, index) => (
          <Card
            key={index}
            name={card.name}
            suit={card.suit}
          />
        ))}
      </div>
    </div>
  );
};

export default PokerTable;