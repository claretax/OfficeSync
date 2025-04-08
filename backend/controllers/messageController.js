const Message = require('../models/Message');

const createMessage = async (req, res) => {
  const { contact_id, template_id } = req.body;
  if (!contact_id || !template_id) return res.status(400).json({ error: 'Contact ID and Template ID are required' });

  try {
    const message = new Message({ contact_id, template_id, mobile_id: 'unknown' }); // Default mobile_id
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit;
    const { startDate, endDate, mobileId } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.datetime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (mobileId) {
      query.mobile_id = mobileId;
    }

    const messages = await Message.find(query)
    .skip(skip)
    .limit(limit)
    .populate('contact_id', 'name phone_number')
    .populate('template_id', 'content')
    .sort({ datetime: -1 });

      const totalMessages = await Message.countDocuments();

      res.status(200).json({
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        currentPage: page,
        messages,
      });
      
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPendingMessages = async (req, res) => {
  try {
    const messages = await Message.find({ status: 'Pending' })
      .populate('contact_id', 'phone_number')
      .populate('template_id', 'content');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMessageStatus = async (req, res) => {
  const { status, mobile_id } = req.body;
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status, mobile_id, datetime: new Date() },
      { new: true }
    ).populate('contact_id', 'phone_number').populate('template_id', 'content');
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 const getAggregatedStats = async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = startDate && endDate ? {
    datetime: { $gte: new Date(startDate), $lte: new Date(endDate) }
  } : {};
  const stats = await Message.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalSent: { $sum: { $cond: [{ $eq: ['$status', 'Sent'] }, 1, 0] } },
        totalFailed: { $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] } },
        totalPending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
      },
    },
  ]);
  res.json(stats[0] || { totalSent: 0, totalFailed: 0, totalPending: 0 });
};
const getMobileStats = async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = startDate && endDate ? {
    datetime: { $gte: new Date(startDate), $lte: new Date(endDate) }
  } : {};

  const stats = await Message.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$mobile_id',
        sent: { $sum: { $cond: [{ $eq: ['$status', 'Sent'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
      },
    },
  ]);
  res.json(stats);
};



module.exports = { createMessage, getMessages, getPendingMessages, updateMessageStatus, getAggregatedStats, getMobileStats };