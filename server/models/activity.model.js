import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    // 1. Performer (The person doing the action)
    performerType: {
        type: String,
        required: true,
        enum: ['Admin', 'Employee'] // These must match your Model names exactly
    },
    performerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'performerType' // This tells Mongoose: "Look at performerType to know if I'm an Admin or Employee"
    },

    // 2. The Action details
    action: {
        type: String, 
        required: true 
        // Example: "TASK_ASSIGNED", "WORK_STARTED", "PROFILE_UPDATED"
    },

    // 3. The Target (The object being affected)
    targetType: {
        type: String,
        required: true,
        enum: ['Task', 'Report', 'Admin', 'Employee']
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'targetType'
    },

    description: {
        type: String,
        required: true // e.g., "Admin Sarah assigned 'Design UI' to Mike"
    },

    metadata: {
        type: Object,
        default: {} // Store things like { oldStatus: 'Pending', newStatus: 'Accepted' }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for fast sorting by date
activitySchema.index({ createdAt: -1 });

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;