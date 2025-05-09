import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    performance: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },
    dailyFee: {
      type: Number,
      required: true,
    },
    imageUrl: { 
      type: String 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Machine", machineSchema);
