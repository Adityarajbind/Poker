import React from "react";

const Card = ({ name, suit, flipped = false }) => {
  return (
    <div
      className="w-15 max-sm:w-10 aspect-[2.5/3.5]"
    >
      <div
        className={`relative w-full h-full duration-500 transition-transform`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden border border-gray-700 bg-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={`/Cards/${name}_of_${suit}.svg`}
          />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden border border-gray-600 bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="w-[80%] h-[85%] rounded-sm border-2 border-white flex items-center justify-center">
            <span className="text-white font-black text-xl">♠</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;