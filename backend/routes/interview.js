const express = require('express');
const { generateInterviewTopics, generateTopicContent, generateQuiz, submitQuiz } = require('../controllers/interviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/topics', authMiddleware, generateInterviewTopics);
router.post('/topic-content', authMiddleware, generateTopicContent);
router.post('/quiz', authMiddleware, generateQuiz);
router.post('/quiz/submit', authMiddleware, submitQuiz);

module.exports = router;