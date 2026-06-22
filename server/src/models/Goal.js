const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    goalName: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true, min: 0 },
    currentAmount: { type: Number, required: true, min: 0, default: 0 },
    deadline: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);