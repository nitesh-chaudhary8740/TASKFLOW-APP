const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    // _id: The unique identifier for this sequence (e.g., 'taskid')
    _id: { 
        type: String, 
        required: true,
        trim: true
    },
    // seq: The current highest number assigned in this sequence
    seq: { 
        type: Number, 
        default: 0,
        required: true
    }
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;