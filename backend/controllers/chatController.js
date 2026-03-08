const { generateContent } = require('../utils/groqService');

const RESTRICTED_TOPICS = ['movie', 'film', 'actor', 'actress', 'cricket', 'sports', 'game', 'politics', 'celebrity', 'entertainment'];

const isCareerRelated = (question) => {
  const lowerQuestion = question.toLowerCase();
  return !RESTRICTED_TOPICS.some(topic => lowerQuestion.includes(topic));
};

const generateMockResponse = (question) => {
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes('resume')) {
    return 'To improve your resume: 1) Add quantifiable achievements with metrics 2) Use action verbs (Developed, Implemented, Led) 3) Tailor to job descriptions 4) Include keywords 5) Keep it concise. Want role-specific tips?';
  }
  if (lowerQuestion.includes('interview')) {
    return 'Interview tips: 1) Practice STAR method for behavioral questions 2) Research the company 3) Practice technical problems 4) Get good sleep before 5) Mock interview with friends. Which role are you preparing for?';
  }
  if (lowerQuestion.includes('job')) {
    return 'Job search tips: 1) Tailor resume/cover letter 2) Use LinkedIn actively 3) Network 4) Apply to multiple positions daily 5) Follow up 6) Consider recruiters. What field interests you?';
  }
  return 'I can help with resume tips, interview prep, job search, and career growth. What would you like to know?';
};
};

const askBot = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.userId;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Check if question is career-related
    if (!isCareerRelated(question)) {
      return res.json({
        question,
        answer: "I'm specifically designed to help with career-related topics like resume building, job search, interview preparation, and professional development. I politely decline to discuss movies, entertainment, or other non-career topics. How can I help you with your career? 😊",
        isCareerRelated: false,
      });
    }

    const prompt = `You are a helpful and professional career coach bot. A user is asking: "${question}"
    
Please provide:
1. A concise and practical answer
2. Actionable advice if applicable
3. Tips or best practices
4. Resources or next steps if needed

Keep the response professional, helpful, and focused on career development, job search, resume writing, interview preparation, and professional growth.`;

    let answer;
    try {
      answer = await generateContent(prompt);
    } catch (apiError) {
      console.error('Groq API Error:', apiError.message);
      answer = generateMockResponse(question);
    }

    res.json({
      question,
      answer,
      isCareerRelated: true,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { askBot };