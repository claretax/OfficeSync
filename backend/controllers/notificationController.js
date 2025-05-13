const {Notification , NotificationRule} = require('../models/Notification');
const Project = require('../models/Project');

//Notification Controller
//all the notifications
const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({}).populate('rules.ruleId');

    const enrichedNotifications = [];

    for (const notification of notifications) {
      const rules = notification.rules.map(rule => ({
        ruleId: rule.ruleId._id,
        name: rule.ruleId.name,
        condition: rule.ruleId.condition,
        recipientRoles: rule.ruleId.recipientRoles,
        recipientUserIds: rule.ruleId.recipientUserIds,
        messageTemplate: rule.ruleId.messageTemplate,
        channel: rule.ruleId.channel,
        isActive: rule.isActive
      }));

      // Fetch the associated project
      const project = await Project.findById(notification.projectId).populate({
        path: 'team',
        populate: [
          { path: 'teamLeader', model: 'User' },
          { path: 'teamMembers', model: 'User' }
        ]
      });

      // Generate messagesData
      let messagesData = [];

      rules.forEach(rule => {
        rule.recipientRoles.forEach(role => {
          if (role === 'project_lead' && project?.team?.teamLeader?.phone) {
            messagesData.push({
              ruleName: rule.name,
              phone: project.team.teamLeader.phone,
              message: rule.messageTemplate
            });
          } else if (role === 'project_member' && Array.isArray(project?.team?.teamMembers)) {
            const phones = project.team.teamMembers.map(m => m.phone).filter(Boolean);
            if (phones.length > 0) {
              messagesData.push({
                ruleName: rule.name,
                phone: phones,
                message: rule.messageTemplate
              });
            }
          }
        });
      });
      // Attach messagesData to notification
      const enrichedNotification = {
        ...notification.toObject(),
        messagesData
      };
      enrichedNotifications.push(enrichedNotification);
    }
    return res.status(200).json(enrichedNotifications);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


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
// Add these new controller methods

// Update notification status
const updateNotificationStatus = async (req, res) => {
  const { notificationId, recipientId, status } = req.body;
  
  try {
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Find the specific notification for this recipient
    let updated = false;
    
    for (const rule of notification.rules) {
      for (const notif of rule.notifications) {
        if (notif.recipientId.toString() === recipientId) {
          notif.status = status;
          
          // Update timestamps based on status
          if (status === 'sent') {
            notif.sentAt = new Date();
          } else if (status === 'read') {
            notif.readAt = new Date();
          } else if (status === 'delivered') {
            notif.deliveredAt = new Date();
          }
          
          notif.updatedAt = new Date();
          updated = true;
        }
      }
    }
    
    if (!updated) {
      return res.status(404).json({ message: 'Recipient notification not found' });
    }
    
    await notification.save();
    return res.status(200).json({ message: 'Notification status updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
  try {
    const stats = {
      total: 0,
      pending: 0,
      sent: 0,
      read: 0,
      failed: 0
    };
    
    const notifications = await Notification.find();
    
    notifications.forEach(notification => {
      notification.rules.forEach(rule => {
        rule.notifications.forEach(notif => {
          stats.total++;
          stats[notif.status]++;
        });
      });
    });
    
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Export the new methods
module.exports = {
  getNotifications,
  getNotificationByProjectId,
  getNotificationRules,
  addNotificationRule,
  deleteNotificationRule,
  updateNotificationStatus,  // New method
  getNotificationStats       // New method
};