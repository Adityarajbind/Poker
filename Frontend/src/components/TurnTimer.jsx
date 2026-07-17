import { useEffect, useState } from "react";

const TurnTimer = ({ active, startedAt, duration = 25000 }) => {
  const [progress, setProgress] = useState(100);
  const color =
    progress > 60
      ? "bg-green-500"
      : progress > 30
        ? "bg-yellow-500"
        : "bg-red-500";

  useEffect(() => {
    if (!active) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;

      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);

      setProgress(remaining);
    }, 30);

    return () => clearInterval(interval);
  }, [active, startedAt, duration]);

  if (!active) return null;

  return (
    <div className="h-1 w-25 rounded-b-xs bg-zinc-700 overflow-hidden">
<div
    className={`h-full ${color} transition-[width] duration-75`}
    style={{ width: `${progress}%` }}
/>
    </div>
  );
};

export default TurnTimer;
