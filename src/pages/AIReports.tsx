import { Activity, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

const AIReports = () => {
  const [filter, setFilter] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000); // Update time every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const reports = [
    {
      title: 'System Health Overview',
      status: 'healthy',
      description: 'All system metrics are within normal ranges. No immediate action required.',
      recommendations: [
        'Continue monitoring CPU usage during peak hours',
        'Consider scheduling routine maintenance',
      ],
    },
    {
      title: 'Resource Usage Patterns',
      status: 'warning',
      description: 'Memory usage has shown increasing trends over the past 24 hours.',
      recommendations: [
        'Investigate processes with high memory consumption',
        'Consider increasing RAM if trend continues',
      ],
    },
    {
      title: 'Performance Bottlenecks',
      status: 'critical',
      description: 'Disk I/O showing signs of saturation during peak loads.',
      recommendations: [
        'Optimize disk access patterns',
        'Consider upgrading to SSD storage',
        'Review and optimize database queries',
      ],
    },
    {
      title: 'Network Activity Anomalies',
      status: 'warning',
      description: 'Unusual spikes in network traffic detected during non-peak hours.',
      recommendations: [
        'Check for unauthorized access or malware',
        'Monitor network traffic patterns',
        'Consider implementing rate limiting',
      ],
    },
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

  const filteredReports = filter === 'all' ? reports : reports.filter((report) => report.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-accent-500">AI System Analysis Reports</h2>
        <div className="flex items-center space-x-4">
          <Filter className="text-slate-300" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-navy-800 text-slate-300 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-accent-500"
          >
            <option value="all">All</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="text-right text-slate-400 text-sm">Real-time: {currentTime}</div>

      <div className="grid grid-cols-1 gap-6">
        {filteredReports.map((report, index) => (
          <div
            key={index}
            className={`border ${getStatusColor(report.status)} rounded-lg p-6 hover-card animate-slide-in`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(report.status)}
                <h3 className="text-xl font-semibold text-blue-accent-500">{report.title}</h3>
              </div>
              <span className="text-slate-400 text-sm">{currentTime}</span>
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
