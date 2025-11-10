const mongoose = require('mongoose');

// Define the schema for the User model
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    orgnization: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
      
    },
    password: {
        type: String,
        required: true,
      
    }
}, { 
    // 👇 Key Change: Automatically adds createdAt and updatedAt fields
    timestamps: true
});

// Create and export the model named 'User'
const Admin = mongoose.model('Admin', adminSchema);

module.exports = {Admin}