const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    remark:{
        type: String,
        required: true,
        trim: true
    },
    requestedData:[{
        title:{
            type: String,
            required: true,
            trim: true
        },
        isReceived:{
            type: Boolean,
            default: false
        },
        receivedAt:{
            type: Date,
            default: null
        },
        createdAt:{
            type: Date,
            default: Date.now
        },
        }],
        quoteSent:{
            type: Boolean,
            default: false
        },
        status:{
            type: String,
            enum: ['open', 'closed', 'scheduled', 'in progress', 'completed'],
            default: 'open'
        },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
})

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;