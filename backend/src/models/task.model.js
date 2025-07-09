import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ""
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true
    }
  },
  {
    timestamps: true 
  }
);

export const Task = mongoose.model("Task", taskSchema);
