import { Outlet, useNavigate } from 'react-router-dom';
import React from 'react';

export default function BaseLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleHome = () => {
    navigate(isAdmin ? '/admin' : '/user');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Fixed Glass Navbar */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            onClick={handleHome}
            className="flex items-center cursor-pointer group"
          >
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
            {/* <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-blue-600 transition-all">
              LabGuardian Visage 
            </h1> */}
            {/* <span className="text-sm text-gray-500 ml-2">({isAdmin ? 'Admin' : 'User'} Panel)</span> */}
          </div>
          
          <nav className="flex items-center gap-4">
            <button 
              onClick={handleHome}
              className="px-4 py-2 text-sm font-medium rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
            </button>
            {/* {isAdmin && (<button
              className="px-4 py-2 text-sm font-medium rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
              onClick={() => navigate('/user')}
            >User Dashboard </button>)} */}
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md transition-all"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>

      {/* Glass Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-white/20 py-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LabVisage {isAdmin ? 'Admin' : 'User'} Panel. Secure exam monitoring system.</p>
        </div>
      </footer>
    </div>
  );
}