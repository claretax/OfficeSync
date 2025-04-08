const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadContacts, getContacts } = require('../controllers/contactController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadContacts);
router.get('/', getContacts);

module.exports = router;