import { useState } from 'react';
import axios from '../apiService/ApiService';
import { useNavigate } from 'react-router-dom';

export default function AddLab() {
  const [labCode, setLabCode] = useState('');
  const [labName, setLabName] = useState('');
  const [labDescription, setLabDescription] = useState('');
  const [labClientsCount, setLabClientsCount] = useState(0);
  const [labLock, setLabLock] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No authentication token found");
      }
    
      const res = await axios.post(
        '/admin/labs',
        {
          labCode,
          labName,
          labDescription,
          labClientsCount,
          labLock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      if (res.data.message) {
        setMessage(res.data.message);
        setTimeout(() => navigate('/admin'), 1500);
      }
    } catch (err) {
      if (err.response) {
        setMessage('Error: ' + (err.response.data.message || err.response.statusText));
      } else if (err.request) {
        setMessage('Network Error: No response from server');
      } else {
        setMessage('Error: ' + err.message);
      }
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        {/* Glass Card Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Add New Lab</h2>
            <p className="text-blue-100 mt-1">Configure lab monitoring settings</p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Lab Code */}
            <div>
              <label htmlFor="labCode" className="block text-sm font-medium text-gray-700 mb-1">
                Lab Code
              </label>
              <input
                id="labCode"
                type="text"
                placeholder="Enter lab code"
                value={labCode}
                onChange={(e) => setLabCode(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/70 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isLoading}
              />
            </div>
            
            {/* Lab Name */}
            <div>
              <label htmlFor="labName" className="block text-sm font-medium text-gray-700 mb-1">
                Lab Name
              </label>
              <input
                id="labName"
                type="text"
                placeholder="Enter lab name"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/70 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isLoading}
              />
            </div>
            
            {/* Lab Description */}
            <div>
              <label htmlFor="labDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                id="labDescription"
                type="text"
                placeholder="Enter description"
                value={labDescription}
                onChange={(e) => setLabDescription(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/70 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isLoading}
              />
            </div>
            
            {/* Clients Count */}
            <div>
              <label htmlFor="labClientsCount" className="block text-sm font-medium text-gray-700 mb-1">
                Client Capacity
              </label>
              <input
                id="labClientsCount"
                type="number"
                placeholder="Enter client capacity"
                value={labClientsCount}
                onChange={(e) => setLabClientsCount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/70 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isLoading}
                min="0"
              />
            </div>
            
            {/* Lab Lock */}
            <div className="flex items-center">
              <input
                id="labLock"
                type="checkbox"
                checked={labLock}
                onChange={(e) => setLabLock(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="labLock" className="ml-2 block text-sm text-gray-700">
                Lock Lab (Prevent new connections)
              </label>
            </div>
            
            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}>
                {message}
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Lab...
                </span>
              ) : (
                'Add Lab'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}