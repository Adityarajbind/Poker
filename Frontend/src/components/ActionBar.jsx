import { useEffect, useState } from "react";

const ActionBar = ({
  actions,
  player,
  fold,
  check,
  call,
  raise,
  bet,
  allIn,
}) => {
  const [showSlider, setShowSlider] = useState(false);
  const [amount, setAmount] = useState(20);

  useEffect(() => {
    if (player) {
      setAmount(Math.min(20, player.chips));
    }
  }, [player]);

  const confirm = () => {
    if (amount >= player.chips) {
      allIn();
    } else if (actions.includes("raise")) {
      raise(amount);
    } else {
      bet(amount);
    }

    setShowSlider(false);
  };

  return (
    <>
      {/* Slider */}
      {showSlider && (
        <div className="fixed bottom-15 right-0 z-50 flex flex-col items-center gap-4 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2">

          <span className="text-xl font-bold text-orange-400">
            {amount >= player.chips ? "ALL IN" : amount}
          </span>

          <input
            type="range"
            min={20}
            max={player.chips}
            step={10}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-56 w-4/5 cursor-pointer appearance-none bg-gray-400 rounded-md"
            style={{
              writingMode: "vertical-lr",
              direction: "rtl",
            }}
          />

          <button
            onClick={confirm}
            className={`rounded-lg px-3 py-1.5 font-bold ${
              amount >= player.chips
                ? "bg-red-600"
                : "bg-orange-500"
            }`}
          >
            {amount >= player.chips
              ? "ALL IN"
              : actions.includes("raise")
              ? "Raise"
              : "Bet"}
          </button>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 flex w-full justify-center gap-4 border-t border-zinc-900 bg-neutral-800 px-4 py-2 text-white">

        {actions.includes("fold") && (
          <button
            onClick={fold}
            className="rounded-lg bg-red-400 px-4 py-2"
          >
            Fold
          </button>
        )}

        {actions.includes("check") && (
          <button
            onClick={check}
            className="rounded-lg bg-green-500 px-4 py-2"
          >
            Check
          </button>
        )}

        {actions.includes("call") && (
          <button
            onClick={call}
            className="rounded-lg bg-green-500 px-4 py-2"
          >
            Call
          </button>
        )}

        {(actions.includes("raise") || actions.includes("bet")) && (
          <button
            onClick={() => setShowSlider((prev) => !prev)}
            className="rounded-lg bg-green-500 px-4 py-2"
          >
            {showSlider
              ? "Cancel"
              : actions.includes("raise")
              ? "Raise"
              : "Bet"}
          </button>
        )}

        {actions.includes("allin") && (
          <button
            onClick={allIn}
            className="rounded-lg bg-red-500 px-4 py-2"
          >
            All In
          </button>
        )}
      </div>
    </>
  );
};

export default ActionBar;