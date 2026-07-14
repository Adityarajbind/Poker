import Card from "./Card";
import PlayerSeat from "./PlayerSeat";
const PokerTable = ({ game, player, myId }) => {
  const seatPositions = [
    "-bottom-2 left-1/2 -translate-x-1/2", // You
    "top-0 left-1/2 -translate-x-1/2",
    "top-20 -right-7",
    "top-20 -left-7",
    "bottom-20 -left-7",
    "bottom-20 -right-7",
  ];
  const raisePositions = [
    "bottom-20 left-1/2 -translate-x-1/2", // You
    "top-12 left-1/2 -translate-x-1/2",
    "top-12 right-10",
    "top-12 left-10",
    "bottom-12 left-10",
    "bottom-12 right-10",
  ];
  return (
    <div className="w-[900px] h-[420px] max-sm:w-[75%] max-sm:h-[75vh] rounded-full relative">
      <div className="bg-green-800 rounded-full  border-[5px] w-full h-full border-zinc-700 flex flex-col justify-center items-center absolute overflow-hidden">
        <div
          className="table-cloth absolute top-0 left-0 w-full h-full opacity-20"
          style={{ backgroundImage: 'url("/tablCloth.png")' }}
        ></div>
        <div className="absolute top-1/4">
          <h2 className="text-white text-3xl max-sm:text-[1.6rem]  font-bold">
            Pot
          </h2>

          <p className="text-orange-400 text-2xl max-sm:text-xl mb-1">
            {game.pot}
          </p>
        </div>
        <div className="flex gap-2 max-sm:gap-1 z-80">
          {game.communityCards.map((card, index) => (
            <Card key={index} name={card.name} suit={card.suit} />
          ))}
        </div>
      </div>
      {game.players.map((player,index) => {
        const hideCards = player.id !== myId && game.gameStage !== "finished";
        return (
          <div
            key={player.id}
            className={`absolute ${seatPositions[index]} flex justify-center`}
          >
            <PlayerSeat
              player={player}
              isDealer={index === game.dealerIndex}
              isCurrentPlayer={
                player.id === game.players[game.currentPlayer]?.id
              }
              hideCards={hideCards}
            />
            {player.currentBet > 0 && (
              <div
                className={`absolute rounded-sm bg-white/50 px-3 py-1 text-sm font-bold ${raisePositions[index]}`}
              >
                {player.currentBet}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PokerTable;
