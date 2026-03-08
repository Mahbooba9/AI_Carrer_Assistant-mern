const express = require('express');
const { askBot } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/ask', authMiddleware, askBot);

module.exports = router;