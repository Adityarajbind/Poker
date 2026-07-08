import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      unique: true,
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        username: {
          type: String,
          required: true,
        },

        isBot: {
          type: Boolean,
          default: false,
        },

        ready: {
          type: Boolean,
          default: false,
        },

        seat: {
          type: Number,
          default: 0,
        },

        chips: {
          type: Number,
          default: 1000,
        },
      },
    ],
    status: {
      type: String,
      enum: ["waiting", "playing", "finished"],
      default: "waiting",
    },

    maxPlayers: {
      type: Number,
      default: 8,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
