import React from 'react';

export default function AboutPage() {
  const contributors = [
    {
      usn: '2KE21CS100',
      name: 'Shrinivas Masti',
      contribution: 'Testing & Documentation'
    },
    {
      usn: '2KE21CS102',
      name: 'Shripad Kulkarni',
      contribution: 'Frontend Development'
    },
    {
      usn: '2KE21CS109',
      name: 'Srinidhi Chappar',
      contribution: 'Client Monitoring System'
    },
    {
      usn: '2KE21CS113',
      name: 'Suraj Kr Das',
      contribution: 'Backend API Development'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">About LabVisage</h1>
            <p className="text-blue-100 mt-2">Exam Monitoring System</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Description</h2>
              <p className="text-gray-600">
                LabVisage is a comprehensive exam monitoring system designed to maintain academic integrity during lab-based online examinations. 
                The system provides real-time monitoring of client activities, malpractice detection, and centralized oversight for administrators.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Development Team</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        USN
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contribution
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contributors.map((person, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {person.usn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {person.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {person.contribution}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <h3 className="text-lg font-medium text-gray-900">Project Guide</h3>
            <p className="mt-2 text-2xl font-semibold text-indigo-700">
                Mrs. Suman Yaligar
            </p>
            <p className="mt-4 text-sm text-gray-600">
                We express our sincere gratitude to our project guide for her invaluable guidance, 
                continuous support, and expert advice throughout the development of this project.
            </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} LabVisage. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}