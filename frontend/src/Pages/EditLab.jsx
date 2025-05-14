import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../apiService/ApiService";

const EditLab = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState({
    labCode: "",
    labName: "",
    labDescription: "",
    labClientsCount: 0,
    labLock: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token provided.");
          setLoading(false);
          return;
        }
        const response = await axios.get(`/admin/labs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLab(response.data.lab);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch lab details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLab();
    }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLab({ ...lab, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setLab({ ...lab, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token provided.");
        return;
      }
      await axios.post(`/admin/labs/${id}`, lab, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Lab updated successfully!");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update lab.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading lab details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-md mx-auto">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md">
        {/* Glass Card Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Edit Lab</h1>
            <p className="text-blue-100 mt-1">Update lab configuration</p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Lab Code (read-only) */}
            <div>
              <label htmlFor="labCode" className="block text-sm font-medium text-gray-700 mb-1">
                Lab Code
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200"> 
                {lab.labCode}
              </div>
              <p className="mt-1 text-xs text-gray-500">Lab code cannot be modified</p>
            </div>
            
            {/* Lab Name */}
            <div>
              <label htmlFor="labName" className="block text-sm font-medium text-gray-700 mb-1">
                Lab Name
              </label>
              <input
                id="labName"
                type="text"
                name="labName"
                value={lab.labName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/70 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isSubmitting}
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
                name="labDescription"
                value={lab.labDescription}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/70 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Client Count */}
            <div>
              <label htmlFor="labClientsCount" className="block text-sm font-medium text-gray-700 mb-1">
                Client Capacity
              </label>
              <input
                id="labClientsCount"
                type="number"
                name="labClientsCount"
                value={lab.labClientsCount}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-white/70 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Lab Lock */}
            <div className="flex items-center">
              <input
                id="labLock"
                type="checkbox"
                name="labLock"
                checked={lab.labLock}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="labLock" className="ml-2 block text-sm text-gray-700">
                Lock Lab (Prevent new connections)
              </label>
            </div>
            
            {/* Message Display */}
            {message && (
              <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium text-white transition-all ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update Lab'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLab;