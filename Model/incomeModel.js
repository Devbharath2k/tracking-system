import mongoose from "mongoose";

const { Schema } = mongoose;

const incomeSchema = new Schema(
  {
    icon: {
      type: String,
    },
    source: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    date: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);

export default Income;
