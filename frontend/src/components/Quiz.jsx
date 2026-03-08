import React, { useState } from 'react';
import { interviewAPI } from '../services/api';

export default function Quiz({ quiz, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await interviewAPI.submitQuiz(quiz._id, answers);
      setResult(response.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md w-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Quiz Completed!</h1>
            <div className="text-6xl font-bold text-blue-600 mb-6">
              {result.score}/{result.total}
            </div>
            <p className="text-2xl font-semibold text-gray-700 mb-8">
              {Math.round((result.score / result.total) * 100)}% Score
            </p>
            <button
              onClick={onBack}
              className="btn btn-primary w-full"
            >
              Back to Interview Prep
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">📝 Quiz</h1>
          <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="card">
          <div className="mb-8">
            <div className="bg-gray-200 h-2 rounded-full mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion] === option
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="mr-3"
                />
                <span className="text-lg">{option}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn btn-secondary"
            >
              ← Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}