// utils/notificationUtils.js
const { NotificationRule } = require('../models/Notification');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * Enriches notification rules with recipient data and formats according to schema
 * @param {string} ruleId - The notification rule ID
 * @param {string} projectId - The project ID
 * @returns {Object} Formatted rule object ready for notification schema
 */
async function enrichNotificationRules(ruleId, projectId) {

  const notificationRule = await NotificationRule.findOne({_id:ruleId});
  if (!notificationRule) {
    throw new Error(`NotificationRule with id ${ruleId} not found`);
  }
    const project = await Project.findById(projectId).populate({
        path: 'team',
        populate: [
            { path: 'teamLeader', model: 'User' },
            { path: 'teamMembers', model: 'User' }
        ]
    });
    
    if (!notificationRule) {
        throw new Error(`NotificationRule with id ${ruleId} not found`);
    }
    
    if (!project) {
        throw new Error(`Project with id ${projectId} not found`);
    }
    
    // Collect recipients based on roles
    let recipients = [];
    
    // Process recipient roles
    notificationRule.recipientRoles.forEach(role => {
        if (role === 'project_lead' && project.team?.teamLeader) {
            recipients.push(project.team.teamLeader);
        } else if (role === 'project_member' && project.team?.teamMembers) {
            recipients = [...recipients, ...project.team.teamMembers];
        } else if (role === 'admin' || role === 'manager') {
            // You might want to fetch these users separately
            // This is a placeholder for that logic
        }
    });
    
    // Add specific user recipients if any
    if (notificationRule.recipientUserIds && notificationRule.recipientUserIds.length > 0) {
        const specificUsers = await User.find({
            _id: { $in: notificationRule.recipientUserIds }
        });
        recipients = [...recipients, ...specificUsers];
    }
    
    // Remove duplicates by user ID
    recipients = recipients.filter((recipient, index, self) =>
        index === self.findIndex(r => r._id.toString() === recipient._id.toString())
    );
    
    // Format notifications array for each recipient
    const notifications = recipients.map(recipient => ({
        recipientId: recipient._id,
        message: formatMessage(notificationRule.messageTemplate, project, recipient),
        frequency: notificationRule.frequency,
        status: 'pending',
        errorMessage: null,
        sentAt: null,
        readAt: null,
        deliveredAt: null,
        updatedAt: new Date()
    }));    
    // Return the formatted rule object according to schema
    return {
        ruleId,
        notifications,
        appliedAt: new Date(),
        isActive: true
    };
}

/**
 * Format message template with project and recipient data
 * @param {string} template - Message template with placeholders
 * @param {Object} project - Project data
 * @param {Object} recipient - Recipient user data
 * @returns {string} Formatted message
 */
function formatMessage(template, project, recipient) {
    let message = template;
    
    // Replace project placeholders
    if (project) {
        message = message.replace(/{project\.name}/g, project.name || '');
        message = message.replace(/{project\.description}/g, project.description || '');
        message = message.replace(/{project\.status}/g, project.status || '');
        
        // Format dates if they exist
        if (project.startDate) {
            message = message.replace(/{project\.startDate}/g, new Date(project.startDate).toLocaleDateString());
        }
        if (project.endDateTeam) {
            message = message.replace(/{project\.endDateTeam}/g, new Date(project.endDateTeam).toLocaleDateString());
        }
        if (project.endDateClient) {
            message = message.replace(/{project\.endDateClient}/g, new Date(project.endDateClient).toLocaleDateString());
        }
    }
    
    // Replace recipient placeholders
    if (recipient) {
        message = message.replace(/{recipient\.name}/g, recipient.name || '');
        message = message.replace(/{recipient\.email}/g, recipient.email || '');
    }
    
    return message;
}

/**
 * Convert raw rule to simplified object with metadata
 */
function enrichRule(rule) {
  return {
    ruleId: rule.ruleId._id,
    name: rule.ruleId.name,
    condition: rule.ruleId.condition,
    recipientRoles: rule.ruleId.recipientRoles,
    recipientUserIds: rule.ruleId.recipientUserIds,
    messageTemplate: rule.ruleId.messageTemplate,
    channel: rule.ruleId.channel,
    isActive: rule.isActive
  };
}

/**
 * Generate message data based on rule recipients and project team
 */
function generateMessagesData(rules, project) {
  // Existing implementation
  // ...
}

/**
 * Enrich a single notification with rules and message data
 */
async function enrichNotification(notification) {
  // Existing implementation
  // ...
}

module.exports = {
  enrichNotificationRules,
  enrichRule,
  generateMessagesData,
  enrichNotification,
  formatMessage
};
