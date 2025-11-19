const mongoose = require("mongoose");

// Define the allowed values for the status field
const TASK_STATUS = [
  "Pending",
  "In-Progress",
  "Under-Review",
  "Completed",
  "Blocked",
  "Overdue"
  // Added a common status for real-world tasks
];

// Define the schema for the Task model
const taskSchema = new mongoose.Schema(
  {
    id:{
      type:String,
      unique:true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },

    // 🚀 ENUM IMPLEMENTATION HERE 🚀
    status: {
      type: String,
      default: "Pending", // Set the default status to one of the enum values
      trim: true,
      // The enum array restricts the possible values for this field
      enum: TASK_STATUS,
      // Optional: Custom error message if a value outside the enum is used
      message: "{VALUE} is not a valid task status.",
    },

    isAssigned: {
      type: Boolean,
      default: false,
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model named 'Task'
const Task = mongoose.model("Task", taskSchema);


module.exports = { Task };
