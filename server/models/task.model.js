const mongoose = require("mongoose");
const Counter = require("./counter.model"); // Assuming Counter model is exported here

// --- Constants ---
const TASK_STATUS = [
    "Un-Assigned",
    "Pending",
    "In-Progress",
    "Under-Review",
    "Completed",
    "Blocked",
    "Overdue",
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
const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
Object.freeze(TASK_STATUS_OBJECT)
Object.freeze(TASK_STATUS)
Object.freeze(TASK_PRIORITIES)
// --- Schema Definition ---
const taskSchema = new mongoose.Schema(
    {
        // 1. UNIQUE SEQUENTIAL ID (Display ID)
        id: {
            type: String,
            unique: true,
            trim: true,
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
            type: Date, // Use Date type for robust calculations (e.g., Overdue status)
            required: true,
        },
        priority: {
            type: String,
            required: true,
            trim: true,
            enum: TASK_PRIORITIES, // Add enum for consistency
            default: 'Medium',
        },

        // 2. STATUS FIELD (Enum)
        status: {
            type: String,
            default: TASK_STATUS_OBJECT.UN_ASSIGNED,
            trim: true,
            enum: TASK_STATUS,
        },

        // 3. ASSIGNMENT & TRACKING
        isAssigned: {
            type: Boolean,
            default: false,
        },
        // Reference to the Employee assigned to the task
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null, 
        },
        // Reference to the Admin/Manager who assigned the task
        assignedBy: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin", // Assumes you have an 'Admin' model
            default: null,
        },
        assignmentDate: {
            type: Date,
            default: null,
        },
        // Reference to the Admin/Manager who initially created the task
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin", 
            required: true, // Ensures every task has a creator
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// --- Middleware: Auto-Generate Sequential ID ---
taskSchema.pre("save", async function (next) {
    if (this.isNew && !this.id) {
        try {
            // Atomically find and increment the sequence counter
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'taskid' }, 
                { $inc: { seq: 1 } },
                { new: true, upsert: true } // Creates the counter if it doesn't exist
            );
            
            // Format the ID: e.g., TASK-0001
            this.id = `TASK-${String(counter.seq).padStart(4, "0")}`;
            
        } catch (error) {
            console.error("Error generating sequential task ID:", error);
            return next(error); 
        }
    }
    next();
});

// Create and export the model
const Task = mongoose.model("Task", taskSchema);

module.exports = { Task, TASK_STATUS_OBJECT, TASK_STATUS, TASK_PRIORITIES };