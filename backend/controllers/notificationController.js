const {Notification , NotificationRule} = require('../models/Notification');
const Project = require('../models/Project');

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
  try{
    const notifications = await Notification.findOne({projectId})
    .populate('rules.ruleId');
    const rules = notifications.rules.map((rule) => {
      return {
        ruleId: rule.ruleId._id,
        name: rule.ruleId.name,
        condition: rule.ruleId.condition,
        recipientRoles: rule.ruleId.recipientRoles,
        recipientUserIds: rule.ruleId.recipientUserIds,
        messageTemplate: rule.ruleId.messageTemplate,
        channel: rule.ruleId.channel,
        isActive: rule.isActive
      }
    })

    const project = await Project.findById(req.params.projectId)
    .populate({
      path: 'team',
      populate: [
        { path: 'teamLeader', model: 'User' },
        { path: 'teamMembers', model: 'User' }
      ]
    });

    let messagesData = [];
    // console.log(project)
    rules.forEach(rule => {
      rule.recipientRoles.forEach(r => {
        if(r === 'project_lead'){
          messagesData.push({
            ruleName : rule.name,
            phone : project.team.teamLeader.phone,
            message: rule.messageTemplate
          })
        }else if(r === 'project_member'){
          messagesData.push({
            ruleName : rule.name,
            phone : project.team.teamMembers.map(m => m.phone),
            message: rule.messageTemplate
          })
        }
      })
    });
    console.log(messagesData) 
    return res.status(200).json({notifications, messagesData});
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