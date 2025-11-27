const mongoose = require("mongoose");

// Define the allowed values for the status field
const TASK_STATUS = [
  "Un-Assigned",
  "Pending",
  "In-Progress",
  "Under-Review",
  "Completed",
  "Blocked",
  "Overdue"
 
];
 const TASK_STATUS_OBJECT = {
  UN_ASSIGNED: "Un-Assigned",
  PENDING: "Pending",
  IN_PROGRESS: "In-Progress",
  UNDER_REVIEW: "Under-Review",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
  OVERDUE: "Overdue",
};
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
      default: "Un-Assigned", // Set the default status to one of the enum values
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


module.exports = { Task,TASK_STATUS_OBJECT };
