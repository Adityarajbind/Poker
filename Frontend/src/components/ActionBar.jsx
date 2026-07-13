import { useState } from "react";
const ActionBar = ({ fold, check, call, raise,actions }) => {
  const [raiseAmount, setRaiseAmount] = useState(50);
  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 p-5">
      <div className="flex justify-center gap-4">
        {actions.includes("fold") && <button className="bg-green-400 px-4 py-2 rounded-md text-white" onClick={fold}>Fold</button>}

        {actions.includes("check") && <button className="bg-green-400 px-4 py-2 rounded-md text-white" onClick={check}>Check</button>}

        {actions.includes("call") && <button className="bg-green-400 px-4 py-2 rounded-md text-white" onClick={call}>Call</button>}

        {actions.includes("raise") && (
          <>
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(Number(e.target.value))}
              className="w-72"
            />

            <p className="text-center text-white">Raise : {raiseAmount}</p>

            <button onClick={() => raise(raiseAmount)} className="bg-green-400 px-4 py-2 rounded-md text-white">Raise</button>
          </>
        )}

        {actions.includes("bet") && (
          <>
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(Number(e.target.value))}
              className="w-72"
            />

            <p className="text-center text-white">Raise : {raiseAmount}</p>

            <button onClick={() => raise(raiseAmount)} className="bg-green-400 px-4 py-2 rounded-md text-white">Bet</button>
          </>
        )}

        {actions.includes("allin") && (
          <button onClick={() => allIn()} className="bg-green-400 px-4 py-2 rounded-md text-white">All In</button>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
