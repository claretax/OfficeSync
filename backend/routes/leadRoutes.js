const route = require('express').Router();
const Lead = require('../models/Lead');
const User = require('../models/User');

//Create a new lead
route.post('/', async(req, res) =>{
    const {title, remark, requestedData} = req.body;
    //Validation
    if(!title || !remark || !requestedData){
        return res.status(400).json({message: 'All fields are required'});
    }
    let requestedDataObj = {
        title: requestedData,
    }
    try{
        const client = await User.findOne({role: 'client'});
        if(!client){
            return res.status(404).json({message: 'Client not found'});
        }
        const lead = new Lead({
            title,
            client: client._id,
            remark,
            requestedData:requestedDataObj,
        });
        await lead.save();
        res.status(201).json({message: 'Lead created successfully', lead});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
}
)

//Get all leads
route.get('/', async(req, res) =>{
    try{
        const leads = await Lead.find().populate('client', 'name phone');
        res.status(200).json(leads);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
})
//delete a lead
route.delete('/:id', async(req, res) =>{
    try{
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if(!lead){
            return res.status(404).json({message: 'Lead not found'});
        }
        res.status(200).json({message: 'Lead deleted successfully'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'})
    }
})

module.exports = route;