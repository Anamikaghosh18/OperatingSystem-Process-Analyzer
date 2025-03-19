import React from 'react';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const AIReports = () => {
  const reports = [
    {
      title: 'System Health Overview',
      status: 'healthy',
      description: 'All system metrics are within normal ranges. No immediate action required.',
      recommendations: [
        'Continue monitoring CPU usage during peak hours',
        'Consider scheduling routine maintenance',
      ]
    },
    {
      title: 'Resource Usage Patterns',
      status: 'warning',
      description: 'Memory usage has shown increasing trends over the past 24 hours.',
      recommendations: [
        'Investigate processes with high memory consumption',
        'Consider increasing RAM if trend continues',
      ]
    },
    {
      title: 'Performance Bottlenecks',
      status: 'critical',
      description: 'Disk I/O showing signs of saturation during peak loads.',
      recommendations: [
        'Optimize disk access patterns',
        'Consider upgrading to SSD storage',
        'Review and optimize database queries',
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-400" />;
      case 'warning':
        return <Activity className="text-yellow-400" />;
      case 'critical':
        return <AlertTriangle className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-400/30 bg-green-400/10';
      case 'warning':
        return 'border-yellow-400/30 bg-yellow-400/10';
      case 'critical':
        return 'border-red-400/30 bg-red-400/10';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-blue-accent-500">AI System Analysis Reports</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {reports.map((report, index) => (
          <div 
            key={index} 
            className={`border ${getStatusColor(report.status)} rounded-lg p-6 hover-card animate-slide-in`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(report.status)}
              <h3 className="text-xl font-semibold text-blue-accent-500">{report.title}</h3>
            </div>
            
            <p className="text-slate-300 mb-4">{report.description}</p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-accent-500">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="hover:text-blue-accent-500 transition-colors duration-300">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIReports;