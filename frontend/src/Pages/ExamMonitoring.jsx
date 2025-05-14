import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../apiService/ApiService';
import Alerts from './Alerts'; // Assuming Alerts is a component that handles alert display

export default function ExamMonitoring() {
  const navigate = useNavigate();
  const { labCode } = useParams();
  
  // const location = useLocation();
  
  const [examDetails, setExamDetails] = useState({
    examID: '',
    examName:'',
    labCode,
    isLocked: false,
    UserName: '' // Default to unlocked (exam not started)
  });
  const [clients, setClients] = useState([]);
  const [selectedClientAlerts, setSelectedClientAlerts] = useState([]);
  const [isExam, setExam] = useState(true);

  // Fetch initial exam state and alerts
  useEffect(() => {
    const fetchExamState = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setExam(false);
          return;
        }

        // Get current exam lock status
        try{
          const response = await api.get(`/alerts/${labCode}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // console.log('Exam state response:', response.data);
          const { lock, examID, examName, UserName } = response.data;
          setExamDetails({
            examID: examID, // Ensure examID is preserved
            examName,
            labCode,
            isLocked: lock,
            UserName
          });

        } catch (error) {
          console.error('Error fetching exam lock status:', error);
          setExam(false);
          return;
        }
        

        

        // console.log('Exam state response status :', response.status);

  // const { examID = null, examName = null, UserName = null } = location?.state ?? {};


        // Get connected clients
        const clientsRes = await api.get(`/clients/getallclients/${labCode}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        

        setClients(clientsRes.data || []);
      } catch (error) {
        console.error('Error fetching exam data:', error);
      }
    };

    fetchExamState();

    // Set up polling for real-time updates (every 5 seconds)
    const interval = setInterval(fetchExamState, 5000);
    return () => clearInterval(interval);
  }, [labCode]);

  const toggleExamLock = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      if (examDetails.isLocked) {
        // Stop the exam
        const response = await api.post(`/clients/endexam`, { labCode }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setExamDetails((prev) => ({
            ...prev,
            isLocked: false,
          }));
          navigate('/user'); // Redirect to /user route
        } else {
          console.error('Failed to Stop Exam');
        }
        return;
      }

      // Toggle the lock status
      // const newLockStatus = !examDetails.isLocked;
      const response = await api.post(`/clients/startexam`, { labCode }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setExamDetails((prev) => ({
          ...prev,
          isLocked: true,
        }));
      } else {
        console.error('Failed to Start Exam');
      }
    } catch (error) {
      console.error('Failed to Start Exam. Error:', error);
    }
  };

  const handleClientClick = (clientId) => {
    const clientAlerts = selectedClientAlerts.filter(alert => alert.clientId === clientId);
    setSelectedClientAlerts(clientAlerts);
  };

  if (!isExam) 
    return (
      <div className="text-center py-8 text-gray-500">
        No exam is currently going on.
      </div>
    );


  return (
    <div className="min-h-[calc(100vh-120px)] p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Exam Monitoring Dashboard</h1>
            <p className="text-blue-100 mt-2">
              Lab: {labCode} | Exam: {examDetails.examName} | User: {examDetails.UserName}
            </p>
          </div>
        </div>

        {/* Exam Info */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 mb-8 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Exam ID</h3>
            <p className="text-lg font-semibold">{examDetails.examID}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Lab Code</h3>
            <p className="text-lg font-semibold">{labCode}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="text-lg font-semibold">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                examDetails.isLocked ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {examDetails.isLocked ? 'Exam In Progress' : 'Exam Not Started'}
            </p>
          </div>
        </div>
        {/* Connected Clients Section */}
        {examDetails.isLocked == true ?
          (<Alerts labCode={labCode} />) : 
          (<div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Connected Clients ({clients.length})
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Start the exam only when all the clients have joined
              </p>
              
              {clients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No clients connected yet
                </div>
              ) : (
                <div className="space-y-3">
                  {clients.map(client => (
                    <div
                      key={client.clientId}
                      className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => handleClientClick(client.clientId)}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          client.status === 'malpractice' ? 'bg-red-500' :
                          client.status === 'suspicious' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="font-medium">{client.clientName}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Last active: {new Date(client.lastHeartbeat).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>)
        }

        {/* Start/Stop Button */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 mb-8 p-6 text-center">
          <button
            onClick={toggleExamLock}
            className={`px-8 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all ${
              examDetails.isLocked 
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700' 
            }`}
          >
            {examDetails.isLocked ? 'Stop Exam' : 'Start Exam'}
          </button>
        </div>

        {/* Alerts Section */}
        {/* Previous alert logic commented out for reference */}
        {/**
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Alerts ({selectedClientAlerts.length})
            </h2>
            {selectedClientAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No alerts for the selected client
              </div>
            ) : (
              <div className="space-y-3">
                {selectedClientAlerts.map((alert, index) => (
                  <div key={index} className="bg-red-50/80 p-4 rounded-lg border border-red-200">
                    <div className="flex justify-between">
                      <span className="font-medium text-red-800">{alert.type}</span>
                      <span className="text-sm text-red-600">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{alert.message}</p>
                    <p className="text-xs text-red-900 mt-1">Client: {alert.clientId}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        */}

        {/* Integrating Alerts.jsx component */}
        {/* <Alerts labCode={labCode} /> */}
      </div>
    </div>
  );
}