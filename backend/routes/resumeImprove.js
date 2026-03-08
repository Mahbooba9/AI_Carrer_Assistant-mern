const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { improveResumeWithJD } = require('../controllers/resumeImproveController');

const router = express.Router();

router.post('/', authMiddleware, improveResumeWithJD);

module.exports = router;