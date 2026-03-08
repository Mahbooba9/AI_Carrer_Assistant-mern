const mongoose = require('mongoose');

const courseModuleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advance'],
    default: 'Beginner',
  },
  content: {
    type: String,
    required: true,
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 30,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  jdBased: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CourseModule', courseModuleSchema);