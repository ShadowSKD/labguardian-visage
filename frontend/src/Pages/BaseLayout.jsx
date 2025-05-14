import { Outlet, useNavigate } from 'react-router-dom';
import React from 'react';

export default function BaseLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Fixed Glass Navbar */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center cursor-pointer group"
          >
            {/* <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-blue-600 transition-all">
              LabVisage
            </h1> */}
            <img 
                    src="/ico_light.png" 
                    alt="LabVisage Logo" 
                    className="h-10 w-auto sm:h-12"
                  />
                  <img 
                    src="/light.png" 
                    alt="LabVisage Logo" 
                    className="h-9 w-auto sm:h-11"
                  />
          </div>
          
          <nav className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/about')}
              className="px-4 py-2 text-sm font-medium rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md transition-all"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content with top padding for fixed nav */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Glass Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-white/20 py-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LabVisage. Secure exam monitoring system.</p>
        </div>
      </footer>
    </div>
  );
}