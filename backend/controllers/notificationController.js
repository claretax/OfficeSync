const {Notification , NotificationRule} = require('../models/Notification');

//Notification Controller

//all the notifications
const getNotifications = async (req, res) => {
  try{
    const notifications = await Notification.find({});

    return res.status(200).json(notifications);
  }
  catch(err){
    return res.status(500).json({ message: err.message });
  }
}

// get notification by projectId
const getNotificationByProjectId = async (req, res) => {
  const {projectId} = req.params;
  console.log(projectId);
  try{
    const notifications = await Notification.findOne({projectId})
    .populate('rules.ruleId');
    return res.status(200).json(notifications);
  }
  catch(err){
    return res.status(500).json({ message: err.message });
  }
}

//Notification Rule Controller
const getNotificationRules = async (req, res) => {
  try{
    const rules = await NotificationRule.find();
    return res.status(200).json(rules);
  }
  catch(err){
    return res.status(500).json({ message: err.message });
  }
}
const addNotificationRule = async (req, res) => {
  const {name, condition, recipientRoles, recipientUserIds, messageTemplate, channel} = req.body;
  try{
    const rule = {
      name,
      condition,
      recipientRoles,
      recipientUserIds,
      messageTemplate,
      channel
    };
    const newRule = new NotificationRule(rule);
    await newRule.save();
    res.status(201).json(newRule);
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}

const deleteNotificationRule = async (req, res) => {
  const {id} = req.params;
  try{
    const rule = await NotificationRule.findById(id);
    if(!rule){
      return res.status(404).json({ message: 'Notification Rule not found' });
    }
    await rule.deleteOne();
    res.status(200).json({ message: 'Notification Rule deleted' });
  }catch(err){
    res.status(500).json({ message: err.message });
  }  
}
module.exports = {
  getNotifications,
  getNotificationByProjectId,
  getNotificationRules,
  addNotificationRule,
  deleteNotificationRule
}