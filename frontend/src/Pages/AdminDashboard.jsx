import React, { useState, useEffect } from 'react';
import axios from '../apiService/ApiService';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [labs, setLabs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
    fetchLabs();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/admin/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLabs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/admin/labs/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLabs(res.data.labs);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteLab = async (labCode) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/admin/labs/${labCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLabs();
    } catch (error) {
      console.error('Error deleting lab:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage users and labs for the exam monitoring system</p>
        </div>

        {/* Manage Users Section */}
        <section className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-6 border-b border-white/20 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
            <Link 
              to="/admin/adduser" 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
            >
              + Add User
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="p-4 text-left text-gray-700">Name</th>
                  <th className="p-4 text-left text-gray-700">Email</th>
                  <th className="p-4 text-right text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/50 transition-colors">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        to={`/admin/edituser/${user._id}`} 
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 py-1 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 py-1 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Manage Labs Section */}
        <section className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-6 border-b border-white/20 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Labs</h2>
            <Link 
              to="/admin/addlab" 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
            >
              + Add Lab
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="p-4 text-left text-gray-700">Lab Code</th>
                  <th className="p-4 text-left text-gray-700">Lab Name</th>
                  <th className="p-4 text-left text-gray-700">Description</th>
                  <th className="p-4 text-left text-gray-700">Clients</th>
                  <th className="p-4 text-left text-gray-700">Status</th>
                  <th className="p-4 text-right text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {labs.map((lab) => (
                  <tr key={lab._id} className="hover:bg-white/50 transition-colors">
                    <td className="p-4">{lab.labCode}</td>
                    <td className="p-4">{lab.labName}</td>
                    <td className="p-4">{lab.labDescription}</td>
                    <td className="p-4">{lab.clientNumbers}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lab.labLock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {lab.labLock ? 'Locked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        to={`/admin/editlab/${lab._id}`} 
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 py-1 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteLab(lab.labCode)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 py-1 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}