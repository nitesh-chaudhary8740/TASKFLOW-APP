const mongoose = require('mongoose');

// Define the schema for the User model
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
       
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    
    dueDate: {
        type: String,
        required: true,
      
    },
    priority: {
        type: String,
        required: true,
      
    },
    status:{
        type:String,
        default:"pending",
        trim:true
    },
    assignedTo: [
        {
         employee:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Employee"
            }
        }
    ]
}, { 
    // 👇 Key Change: Automatically adds createdAt and updatedAt fields
    timestamps: true
});

// Create and export the model named 'User'
const Task = mongoose.model('Task', taskSchema);

module.exports = {Task}