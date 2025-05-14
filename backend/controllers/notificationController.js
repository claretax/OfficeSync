const {Notification , NotificationRule} = require('../models/Notification');
const Project = require('../models/Project');

//Notification Controller
//all the notifications
const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({})
    .populate('projectId')
    .populate('rules.ruleId') // populate the notifications array
    .populate({
      path: 'rules.notifications.recipientId',
      select: 'name phone role' // only select name and phone from recipient
    });
    if (!notifications) {
      return res.status(404).json([]);
    }
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// get notification by projectId
const getNotificationByProjectId = async (req, res) => {
  const {projectId} = req.params;
  try{
    const notification = await Notification.findOne({projectId})
    .populate('rules.notifications');
    if(!notification){
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.status(200).json({notification});
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

// delete notification
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.deleteOne();
    res.status(200).json({ message: 'Notification deleted' });
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}

// Update notification status
const updateNotificationStatus = async (req, res) => {
  const { recipientId, status, nextSendAt, ruleId } = req.body;
  
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Find the specific notification for this recipient
    let updated = false;
    
    for (const rule of notification.rules) {
      if (rule.ruleId.toString() !== ruleId) continue;
      for (const notif of rule.notifications) {
        if (notif.recipientId.toString() === recipientId) {
          notif.status = status;
          notif.nextSendAt = nextSendAt;
          notif.updatedAt = new Date();
          
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
  deleteNotification,
  getNotificationRules,
  addNotificationRule,
  deleteNotificationRule,
  updateNotificationStatus,  // New method
  getNotificationStats       // New method
};