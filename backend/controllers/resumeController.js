const Resume = require('../models/Resume');
const { parsePDF, parseDOCX, extractSkills } = require('../utils/resumeParser');
const fs = require('fs');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();

    let resumeText = '';

    if (fileExt === 'pdf') {
      resumeText = await parsePDF(filePath);
    } else if (fileExt === 'docx') {
      resumeText = await parseDOCX(filePath);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Only PDF and DOCX files allowed' });
    }

    const skills = extractSkills(resumeText);

    const existingResume = await Resume.findOne({ userId: req.userId });
    if (existingResume) {
      existingResume.resumeText = resumeText;
      existingResume.fileName = req.file.originalname;
      existingResume.extractedSkills = skills;
      await existingResume.save();
      fs.unlinkSync(filePath);
      return res.json({
        message: 'Resume updated successfully',
        resume: existingResume,
      });
    }

    const resume = await Resume.create({
      userId: req.userId,
      resumeText,
      fileName: req.file.originalname,
      extractedSkills: skills,
    });

    fs.unlinkSync(filePath);

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, getResume };