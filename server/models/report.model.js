const mongoose = require("mongoose");

// Assuming you have separate Mongoose models defined for Task, Employee, and Admin:
// const Task = mongoose.model('Task');
// const Employee = mongoose.model('Employee');
// const Admin = mongoose.model('Admin');

const ReportSchema = new mongoose.Schema({
    /**
     * Report Details
     */
    reportTitle: {
        type: String,
        required: [true, 'Report title is required.'],
        trim: true,
        maxlength: 100
    },
    
    reportDescription: {
        type: String,
        required: [true, 'Report description is required.'],
        trim: true,
    },

    /**
     * Relationship Fields (References)
     */
    
    // Reference to the task this report is about
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // Assumes your Task model is named 'Task'
        required: [true, 'Task reference is required for the report.']
    },

    // Reference to the employee who submitted the report
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // Assumes your Employee model is named 'Employee'
        required: [true, 'Reporter reference is required.']
    },

    // Reference to the admin/manager who will review the report
    reportedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Assumes your Admin model is named 'Admin'
        required: [true, 'Admin recipient reference is required.']
    },

    /**
     * Metadata
     */
    submissionDate: {
        type: Date,
        default: Date.now
    },
    
    // Optional: Field to track the status of the report (e.g., 'Submitted', 'Reviewed', 'Accepted', 'Rejected')
    status: {
        type: String,
        enum: ['SUBMITTED', 'REVIEWED', 'ACCEPTED', 'REJECTED'],
        default: 'SUBMITTED'
    }

}, { 
    timestamps: true // Adds 'createdAt' and 'updatedAt' timestamps automatically
});


// 🎯 Create the Mongoose Model
const Report = mongoose.model('Report', ReportSchema);

module.exports={Report}