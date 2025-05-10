const {NotificationRule} = require('../models/Notification');
const User = require('../models/User');

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

module.exports = {
  getNotificationRules,
  addNotificationRule
}