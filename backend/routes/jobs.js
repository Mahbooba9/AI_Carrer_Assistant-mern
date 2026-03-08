const express = require('express');
const { searchJobsWithFilters } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/search', authMiddleware, searchJobsWithFilters);

module.exports = router;