const mongoose = require('mongoose');
const projectLogSchema = new mongoose.Schema({
    project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Project',
        required : true
    },
    content : {
        type : String,
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
})

const ProjectLog = mongoose.model('ProjectLog', projectLogSchema);
module.exports = ProjectLog;