import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import PlayerSeat from "./PlayerSeat";

const seatPercentCoordinates = [
  { x: 50, y: 90 }, // Seat 0: Bottom
  { x: 50, y: 10 }, // Seat 1: Top
  { x: 85, y: 25 }, // Seat 2: Top Right
  { x: 15, y: 25 }, // Seat 3: Top Left
  { x: 15, y: 75 }, // Seat 4: Bottom Left
  { x: 85, y: 75 }, // Seat 5: Bottom Right
];
const potPercentCoordinate = { x: 50, y: 32 };

const PokerTable = ({ game, player, myId, dealTrigger }) => {
  const [animateHoleCards, setAnimateHoleCards] = useState(false);
  const [renderedCommunityCards, setRenderedCommunityCards] = useState([]);
  const [flyingChips, setFlyingChips] = useState([]);
  const [hideCards, setHideCards] = useState(true);
  const prevBetsRef = useRef({});
  const prevStageRef = useRef("");
  const distributionAnimatedRef = useRef(false);
  useEffect(() => {
    if (game.gameStage === "finished") {
      setHideCards(false);
      const timer = setTimeout(() => {
        setHideCards(true);
      }, 1000);
      return () => clearTimeout(timer);
    }

    setHideCards(true);
  }, [game.gameStage]);
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

  // 1. Trigger Player Deal Animation exactly once when dealTrigger increments
  useEffect(() => {
    if (dealTrigger > 0) {
      setAnimateHoleCards(true);
      const timer = setTimeout(() => {
        setAnimateHoleCards(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dealTrigger]);

  // 2. Safely derive new community cards to animate them uniquely without duplicating past animations
  useEffect(() => {
    if (game.gameStage === "preflop" || game.gameStage === "waiting") {
      setRenderedCommunityCards([]);
    }
  }, [dealTrigger, game.gameStage]);

  useEffect(() => {
    if (!game.communityCards) return;

    setRenderedCommunityCards((prev) => {
      return game.communityCards.map((card) => {
        const cardKey = `${card.name}_${card.suit}`;
        const exists = prev.some((pc) => `${pc.name}_${pc.suit}` === cardKey);

        // Find stagger position among the newly added cards in this state cycle
        const newCards = game.communityCards.filter(
          (c) =>
            !prev.some(
              (pc) => `${pc.name}_${pc.suit}` === `${c.name}_${c.suit}`,
            ),
        );
        const staggerIndex = newCards.findIndex(
          (c) => `${c.name}_${c.suit}` === cardKey,
        );

        return {
          ...card,
          isNew: !exists,
          staggerIndex: exists ? 0 : Math.max(0, staggerIndex),
        };
      });
    });
  }, [game.communityCards]);

  // 3. Monitor Bets & Pots to animate collect and distribute actions
  useEffect(() => {
    if (!game?.players) return;

    const activeFlyingChips = [];

    // Collect Bets: trigger chips flying to pot if a betting round ends (currentBet resets)
    game.players.forEach((p, idx) => {
      const prevBet = prevBetsRef.current[p.id] || 0;
      const currBet = p.currentBet || 0;

      if (prevBet > 0 && currBet === 0 && game.gameStage !== "finished") {
        activeFlyingChips.push({
          id: `collect-${p.id}-${Date.now()}`,
          startX: seatPercentCoordinates[idx].x,
          startY: seatPercentCoordinates[idx].y,
          endX: potPercentCoordinate.x,
          endY: potPercentCoordinate.y,
        });
      }
      prevBetsRef.current[p.id] = currBet;
    });

    // Distribute Pot: Cascade chips from pot to winner(s)
    if (
      game.gameStage === "finished" &&
      !distributionAnimatedRef.current &&
      game.winners?.length > 0
    ) {
      distributionAnimatedRef.current = true;
      game.winners.forEach((winner) => {
        const winnerIndex = game.players.findIndex(
          (p) => p.id === winner.id || p.username === winner.username,
        );
        if (winnerIndex !== -1) {
          // Generate 6 staggered cascading chips for realism
          for (let i = 0; i < 6; i++) {
            activeFlyingChips.push({
              id: `distribute-${winner.id}-${i}-${Date.now()}`,
              startX: potPercentCoordinate.x,
              startY: potPercentCoordinate.y,
              endX: seatPercentCoordinates[winnerIndex].x,
              endY: seatPercentCoordinates[winnerIndex].y,
              delay: i * 0.08,
            });
          }
        }
      });
    }

    if (game.gameStage !== "finished") {
      distributionAnimatedRef.current = false;
    }

    if (activeFlyingChips.length > 0) {
      setFlyingChips((prev) => [...prev, ...activeFlyingChips]);
    }
  }, [game.players, game.gameStage, game.winners]);

  const removeChip = (chipId) => {
    setFlyingChips((prev) => prev.filter((c) => c.id !== chipId));
  };

  return (
    <div className="w-[900px] h-[420px] max-sm:w-[80%] max-sm:h-[65vh] rounded-full relative">
      <div className="bg-green-800 rounded-full border-[5px] w-full h-full border-green-950 flex flex-col justify-center items-center absolute overflow-hidden">
        <div
          className="table-cloth absolute top-0 left-0 w-full h-full opacity-20"
          style={{ backgroundImage: 'url("/tablCloth.png")' }}
        ></div>

        {/* Pot */}
        <div className="absolute top-1/4 flex flex-col items-center">
          <h2 className="text-white text-3xl max-sm:text-[1.6rem] font-bold">
            Pot
          </h2>
          <p className="text-yellow-400 text-2xl max-sm:text-xl mb-1">
            {game.pot} $
          </p>
        </div>

        {/* Community Cards */}
        <div className="flex gap-2 max-sm:gap-1 z-40">
          {renderedCommunityCards.map((card, index) => (
            <Card
              key={`${card.name}_${card.suit}`}
              name={card.name}
              suit={card.suit}
              flipped={false} // Always reveal once arrived
              animateDeal={card.isNew}
              delay={card.isNew ? card.staggerIndex * 0.15 : 0}
              startOffset={{ x: 0, y: -150 }} // Fly down from slightly higher deck layout position
            />
          ))}
        </div>
      </div>

      {/* Players */}
      {game.players.map((player, index) => {
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
              hideCards={player.id !== myId && hideCards}
              animateDeal={animateHoleCards}
              seatIndex={index}
              turnStartedAt={game.turnStartedAt}
              turnDuration={game.turnDuration}
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

      {/* Dynamic Flying Pot Chips layer */}
      <AnimatePresence>
        {flyingChips.map((chip) => (
          <motion.div
            key={chip.id}
            className="absolute w-6 h-6 z-[999] pointer-events-none"
            initial={{
              left: `${chip.startX}%`,
              top: `${chip.startY}%`,
              scale: 0.4,
              opacity: 0,
            }}
            animate={{
              left: `${chip.endX}%`,
              top: `${chip.endY}%`,
              scale: 1,
              opacity: [0, 1, 1, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: chip.delay || 0,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => removeChip(chip.id)}
          >
            <img
              src="/chip.png"
              alt="flying chip"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PokerTable;
