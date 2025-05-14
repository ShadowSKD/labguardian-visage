import { useEffect, useState } from 'react';
import axios from '../apiService/ApiService';

export default function Alerts({ labCode }) {
  const [alerts, setAlerts] = useState([]);
  const [clients, setClients] = useState([]); 

  const fetchClientDetails = (clientId) => {
    const client = clients.find(client => client.clientId === clientId);
    return client || null;
  }

  const fetchAlerts = async () => {
    if (!labCode) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const res = await axios.get(`/alerts/${labCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const clients_res = await axios.get(`/clients/getallclients/${labCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClients(clients_res.data);

      if (res.data && Array.isArray(res.data.log)) {
        setAlerts(res.data.log);
      } else {
        console.error('Unexpected response format:', res.data);
        setAlerts([]);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 7000);
    return () => clearInterval(interval);
  }, [labCode]);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 mb-8 p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Alert Dashboard</h2>

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center bg-gradient-to-r from-red-100 via-red-50 to-white p-3 rounded-xl border border-red-300 shadow-md hover:shadow-lg transition-all min-h-[100px]"
            >
              {/* Client Info (2/5) */}
              <div className="w-2/5 pr-4 border-r border-red-200 flex flex-col justify-center">
                <div className="text-red-800 font-semibold text-lg">
                  {/* Fetch client details using the clientId */}
                  Client Name: {fetchClientDetails(alert.clientId)?.clientName}
                </div>
                <div className="text-sm text-gray-600">
                  Client ID: {alert.clientId}
                  
                </div>
                <div className="text-sm text-gray-600">
                  Status: {alert.alertType}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(alert.alertTS).toLocaleString()}
                </div>
              </div>

              {/* Alert Message (3/5) */}
              <div className="w-3/5 pl-4 flex justify-center items-center">
                <div className="text-xl font-semibold text-red-700 text-center tracking-wide">
                  {alert.alertMsg}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No alerts available.</p>
      )}
    </div>
  );
}
