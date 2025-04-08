const MessageTemplate = require('../models/MessageTemplate');

const createTemplate = async (req, res) => {
  const { name, content } = req.body;
  if (!name || !content) return res.status(400).json({ error: 'Name and content are required' });

  try {
    const template = new MessageTemplate({ name, content });
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await MessageTemplate.find();
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTemplate, getTemplates };