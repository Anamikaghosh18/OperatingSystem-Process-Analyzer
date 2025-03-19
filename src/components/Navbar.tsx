import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Brain } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-navy-700 text-blue-accent-500' : 'hover:bg-navy-700 hover:text-blue-accent-500';
  };

  return (
    <nav className="bg-navy-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-accent-500">OS Analyzer</h1>
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isActive('/')}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/processes"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isActive('/processes')}`}
              >
                <List size={18} />
                <span>Processes</span>
              </Link>
              <Link
                to="/reports"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isActive('/reports')}`}
              >
                <Brain size={18} />
                <span>AI Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;