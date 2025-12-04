const mongoose = require('mongoose');

// Define the role array for enum validation
const EMP_ROLE = ["employee"]

const empSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 50 // ⬅️ SERVER VALIDATION
    },
    role: {
        type: String,
        default: EMP_ROLE[0],
        trim: true,
        enum: EMP_ROLE
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100 // ⬅️ SERVER VALIDATION
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, // ⬅️ Highly recommended for user management
        maxlength: 100 // ⬅️ SERVER VALIDATION
    },
    designation: {
        type: String,
        required: true,
        // Assuming your 'roles' array maps to Mongoose enum validation here
    },
    password: {
        type: String,
        required: true,
        // NOTE: Password hashing logic should be in a pre-save hook
    },
    phone: {
        type: String,
        required: true,
        maxlength: 15 // ⬅️ SERVER VALIDATION
    },
    address: {
        type: String,
        required: true,
        maxlength: 255 // ⬅️ SERVER VALIDATION
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true // ⬅️ Ensures accountability
    },
    assignedTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ]
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', empSchema);

module.exports = { Employee };