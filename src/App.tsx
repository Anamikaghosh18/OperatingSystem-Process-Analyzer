import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProcessList from './pages/ProcessList';
import AIReports from './pages/AIReports';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy-900 text-slate-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/processes" element={<ProcessList />} />
            <Route path="/reports" element={<AIReports />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;