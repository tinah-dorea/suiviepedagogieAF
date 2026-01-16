import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ 
  children, 
  userType = 'admin', 
  title = 'Dashboard', 
  showStats = false, 
  stats = [] 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userType} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
            </div>
            
            {showStats && stats.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {stats.map((stat, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-lg shadow-sm p-4 md:p-5 border border-gray-100"
                    >
                      <div className="flex items-center">
                        <div 
                          className="rounded-lg p-3 mr-4" 
                          style={{ backgroundColor: `${stat.color}20` }}
                        >
                          {stat.icon && React.createElement(stat.icon, { 
                            className: "h-6 w-6", 
                            style: { color: stat.color } 
                          })}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;