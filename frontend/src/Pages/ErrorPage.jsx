import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage({ code = 404, message = "Page Not Found" }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <h1 className="text-6xl font-bold text-indigo-700">{code}</h1>
      <p className="text-xl text-gray-600 mt-4">{message}</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        Go Back to Home
      </button>
    </div>
  );
}