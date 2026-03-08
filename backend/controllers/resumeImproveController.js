const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const { generateContent } = require('../utils/geminiService');

const getMockImprovements = (role, jdBased) => {
  const improvements = [];
  improvements.push("## Resume Improvements for " + role);
  improvements.push("");
  improvements.push("### Key Areas to Improve:");
  improvements.push("1. Add quantifiable metrics to achievements");
  improvements.push("2. Use stronger action verbs (Developed, Led, Implemented)");
  improvements.push("3. Tailor content to the job description");
  improvements.push("4. Highlight relevant technologies and skills");
  improvements.push("5. Include measurable business impact");
  improvements.push("");
  if (jdBased) {
    improvements.push("###Gap Analysis (compared to JD):");
    improvements.push("- Review skills required in the job description");
    improvements.push("- Identify and highlight matching skills from your resume");
    improvements.push("- Add missing skills or modify bullet points");
  }
  return improvements.join("\\n");
};

const improveResumeWithJD = async (req, res) => {
  try {
    const { role, jdText } = req.body;
    const userId = req.userId;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found. Please upload a resume first.' });
    }

    // Save JD if provided
    let savedJD = null;
    if (jdText) {
      savedJD = await JobDescription.create({
        userId,
        jdText,
        jobRole: role,
      });
    }

    // Generate improvements based on resume and JD
    const prompt = jdText
      ? `I have a resume and a job description. Please analyze them and provide:
1. Gap Analysis - Skills missing in the resume that are required in the JD
2. Matching Skills - Skills from the resume that match the JD requirements
3. Improvement Suggestions - Specific bullet points to add/modify in the resume
4. Priority Areas - Top 3 areas to focus on to match the JD
5. Keywords to Add - Important keywords from JD to include in resume

Resume:
${resume.resumeText}

Job Description:
${jdText}`
      : `I have a resume and want to apply for a ${role} position. 
Here's my resume:
${resume.resumeText}

Please provide:
1. Missing skills I should highlight or develop
2. Improved bullet points for my resume based on the ${role} role
3. Key areas I should focus on to be competitive for this role
4. Tips to make my resume stand out`;

    let improvements;
    try {
      improvements = await generateContent(prompt);
    } catch (apiError) {
      console.error('Gemini API Error:', apiError.message);
      improvements = getMockImprovements(role, !!jdText);
    }

    res.json({
      role,
      improvements,
      currentSkills: resume.extractedSkills,
      jdProvided: !!jdText,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { improveResumeWithJD };