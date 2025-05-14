import React, { useState, useEffect } from 'react';
import api from '../apiService/ApiService';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const [examDetails, setExamDetails] = useState({
    name: '',
    lab: '',
  });
  const [labs, setLabs] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabs = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/admin/labs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const availableLabs = res.data.labs.filter((lab) => !lab.labLock);
        setLabs(availableLabs);
      } catch (error) {
        console.error('Error fetching labs:', error);
        setMessage('Failed to fetch labs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamDetails({
      ...examDetails,
      [name]: value,
    });
    setMessage('');
  };

  const handleSelectLab = (labId) => {
    if (!examDetails.name) {
      setMessage('Please enter the exam name before selecting a lab.');
      return;
    }
    const lab = labs.find(l => l._id === labId);
    setSelectedLab(lab);
    setMessage(`Lab "${lab.labName}" selected`);
  };

  const handleUnselectLab = () => {
    setSelectedLab(null);
    setMessage('Lab selection cancelled');
  };

  const handleCreateExam = async () => {
    if (!selectedLab || !examDetails.name) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const UserID = JSON.parse(localStorage.getItem("user"))._id;
      const UserName = JSON.parse(localStorage.getItem("user")).name;
      const response = await api.post(
        '/clients/createexam',
        {
          examName: examDetails.name,
          labCode: selectedLab.labCode,
          UserID
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/user/exam/${selectedLab.labCode}`, {
        state: {
          examName: examDetails.name,
          labCode: selectedLab.labCode,
          examID: response.data.examID,
          UserName: UserName,
        }
      });
    } catch (error) {
      console.error('Error creating exam:', error);
      setMessage(error.response?.data?.message || 'Failed to create exam.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Exam Monitoring Dashboard</h1>
            <p className="text-blue-100 mt-2">Start a new examination session</p>
          </div>
        </div>

        {/* Exam Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <form className="p-6 space-y-6">
            {/* Exam Name Input */}
            <div>
              <label htmlFor="examName" className="block text-sm font-medium text-gray-700 mb-1">
                Exam Name
              </label>
              <input
                type="text"
                id="examName"
                name="name"
                value={examDetails.name}
                onChange={handleChange}
                placeholder="Enter exam name"
                required
                className="w-full px-4 py-3 bg-white/70 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Labs Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {selectedLab ? 'Selected Lab' : 'Available Labs'}
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedLab ? (
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200 relative">
                  <div>
                    <h3 className="font-medium text-gray-800">{selectedLab.labName}</h3>
                    <p className="text-sm text-gray-600">{selectedLab.labDescription}</p>
                  </div>
                  <button
                    onClick={handleUnselectLab}
                    className="absolute top-3 right-3 px-3 py-1 text-sm bg-white text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : labs.length > 0 ? (
                <ul className="space-y-3">
                  {labs.map((lab) => (
                    <li key={lab._id} className="flex justify-between items-center bg-white/70 p-4 rounded-lg border border-white/20">
                      <div>
                        <h3 className="font-medium text-gray-800">{lab.labName}</h3>
                        <p className="text-sm text-gray-600">{lab.labDescription}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectLab(lab._id)}
                        disabled={!examDetails.name || isLoading}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          !examDetails.name || isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg'
                        }`}
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No available labs found. All labs may be locked or in use.
                </div>
              )}
            </div>

            {/* Create Exam Button */}
            {selectedLab && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleCreateExam}
                  disabled={isLoading}
                  className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${
                    isLoading
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Exam →'}
                </button>
              </div>
            )}

            {/* Status Messages */}
            {message && (
              <div className={`p-3 rounded-lg text-center ${
                message.includes('selected') ? 'bg-blue-50 text-blue-600' : 
                message.includes('cancelled') ? 'bg-yellow-50 text-yellow-600' :
                'bg-red-50 text-red-600'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}