const express = require('express');
const {
  generateInterviewTopics,
  generateCourseContent,
  generateQuizForTopic,
  submitQuiz,
} = require('../controllers/interviewAdvancedController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/topics', authMiddleware, generateInterviewTopics);
router.post('/course', authMiddleware, generateCourseContent);
router.post('/quiz-questions', authMiddleware, generateQuizForTopic);
router.post('/quiz/submit', authMiddleware, submitQuiz);

module.exports = router;