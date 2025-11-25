const mongoose = require('mongoose');

// Define the schema for the User model
const empSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
      
    },
    designation: {
        type: String,
        required: true,
      
    },
    password: {
        type: String,
        required: true,
      
    },
    phone: {
        type: String,
        required: true,
      
    },
    address: {
        type: String,
        required: true,
      
    },
    assignedTasks:[
        {
           
                type:mongoose.Schema.Types.ObjectId,
                ref:"Task"
            
        }
    ]
}, { 
    // 👇 Key Change: Automatically adds createdAt and updatedAt fields
    timestamps: true
});

// Create and export the model named 'User'
const Employee = mongoose.model('Employee', empSchema);

module.exports = {Employee}