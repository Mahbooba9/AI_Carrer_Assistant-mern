import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      setMessage('Please upload a PDF or DOCX file');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const response = await resumeAPI.upload(file);
      setResume(response.data.resume);
      setMessage('Resume uploaded successfully!');
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 font-bold hover:underline mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Upload Your Resume</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="card">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer block"
              >
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-600 mb-2">Drag and drop your resume here</p>
                <p className="text-gray-500 text-sm">or click to select (PDF or DOCX)</p>
                {file && (
                  <p className="text-green-600 font-bold mt-4">Selected: {file.name}</p>
                )}
              </label>
            </div>

            {message && (
              <div className={`${message.includes('failed') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} border px-4 py-3 rounded`}>
                {message}
              </div>
            )}

            {resume && (
              <div className="bg-blue-50 border border-blue-300 rounded p-4">
                <h3 className="font-bold text-lg mb-2">Resume Information</h3>
                <p><strong>File:</strong> {resume.fileName}</p>
                <p><strong>Skills Detected:</strong> {resume.extractedSkills.join(', ')}</p>
                <p><strong>Uploaded:</strong> {new Date(resume.uploadedAt).toLocaleDateString()}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}