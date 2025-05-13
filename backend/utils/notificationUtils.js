// utils/notificationUtils.js
const { NotificationRule } = require('../models/Notification');
const Project = require('../models/Project');


function enrichNotificationRules(ruleId, projectId){
    const notificationRule = NotificationRule.findById(ruleId);
    const project = Project.findById(projectId);
    if (!notificationRule) {
        throw new Error(`NotificationRule with id ${ruleId} not found`);
    }
    let recipients = [];
    notificationRule.recipientRoles.forEach(role => {
        if (role === 'project_lead') {
            recipients.push(project.team.teamLeader);
        }
    })
  return {
    ruleId,
  }
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
  const messagesData = [];

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

  return messagesData;
}

/**
 * Enrich a single notification with rules and message data
 */
async function enrichNotification(notification) {
  const rules = notification.rules.map(enrichRule);

  const project = await Project.findById(notification.projectId).populate({
    path: 'team',
    populate: [
      { path: 'teamLeader', model: 'User' },
      { path: 'teamMembers', model: 'User' }
    ]
  });

  const messagesData = generateMessagesData(rules, project);

  return {
    ...notification.toObject(),
    rules,
    messagesData
  };
}

module.exports = {
  enrichRule,
  generateMessagesData,
  enrichNotification
};
