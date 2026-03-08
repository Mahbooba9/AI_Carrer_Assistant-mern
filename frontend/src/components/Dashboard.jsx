import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const features = [
    {
      title: 'Upload Resume',
      description: 'Upload your resume and let AI analyze it',
      icon: '📄',
      path: '/upload-resume',
    },
    {
      title: 'Job Search',
      description: 'Find jobs matching your skills and experience',
      icon: '🔍',
      path: '/job-search',
    },
    {
      title: 'Resume Improver',
      description: 'Get AI-powered suggestions to improve your resume',
      icon: '✨',
      path: '/resume-improver',
    },
    {
      title: 'Interview Prep',
      description: 'Full courses with modules + 15-20 question quizzes',
      icon: '🎓',
      path: '/interview-prep',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">AI Career Assistant</h1>
            <p className="text-gray-600">Welcome, {user.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="card cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button className="btn btn-primary w-full">Explore</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}