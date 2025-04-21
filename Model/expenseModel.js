import mongoose from "mongoose";

const { Schema } = mongoose;

const expenseSchema = new Schema(
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

const expense = mongoose.model("expense", expenseSchema);

export default expense;
