const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

const parsePDF = async (filePath) => {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Error parsing PDF: ' + error.message);
  }
};

const parseDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error('Error parsing DOCX: ' + error.message);
  }
};

const extractSkills = (text) => {
  const commonSkills = [
    'javascript',
    'python',
    'react',
    'node.js',
    'mongodb',
    'sql',
    'java',
    'c++',
    'aws',
    'docker',
    'kubernetes',
    'git',
    'html',
    'css',
    'vue',
    'angular',
    'express',
    'django',
    'flask',
    'postgresql',
    'mysql',
    'firebase',
    'tensorflow',
    'pandas',
    'numpy',
    'machine learning',
    'data analysis',
    'statistics',
  ];

  const foundSkills = [];
  const textLower = text.toLowerCase();

  commonSkills.forEach((skill) => {
    if (textLower.includes(skill)) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)];
};

module.exports = { parsePDF, parseDOCX, extractSkills };