import React from "react";
import { motion } from "framer-motion";

const Card = ({ name, suit, flipped = false, animateDeal , delay = 0, startOffset = { x: 0, y: 0 } }) => {

  const variants = {
    initial: animateDeal
      ? {
          x: startOffset.x,
          y: startOffset.y,
          scale: 0.2,
          rotate: -45,
          rotateY: 180,
        }
      : {
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          rotateY: flipped ? 180 : 0,
        },
    animate: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      rotateY: flipped ? 180 : 0,
      transition: animateDeal
        ? {
            x: { duration: 0.6, delay, ease: "easeOut" },
            y: { duration: 0.6, delay, ease: "easeOut" },
            scale: { duration: 0.6, delay, ease: "easeOut" },
            rotate: { duration: 0.6, delay, ease: "easeOut" },
            // Wait for travel (0.6s) + 200ms delay, then execute the flip over 0.4 seconds
            rotateY: { duration: 0.4, delay: delay + 0.6 + 0.2, ease: "easeInOut" },
          }
        : {
            rotateY: { duration: 0.3, ease: "easeInOut" },
          },
    },
  };

  return (
    <div className="w-15 max-sm:w-10 aspect-[2.5/3.5]" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        initial="initial"
        animate="animate"
        variants={variants}
      >
        {/* Front (Face-Up) */}
        <div
          className="absolute inset-0 rounded-sm p-0.5 overflow-hidden border border-gray-700 bg-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={`/Cards/${name}_of_${suit}.svg`}
            alt={`${name} of ${suit}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Back (Face-Down) */}
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
      </motion.div>
    </div>
  );
};

export default Card;