import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { io } from 'socket.io-client';
import ProcessChatbot from '../components/ProcessChatbot';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: { total: 1, used: 0, free: 0 },
    network: { rx_sec: 0, tx_sec: 0 },
    disk: { size: 1, used: 0, free: 0 },
    processes: []
  });

  const [chartData, setChartData] = useState({
    labels: Array(30).fill(''),
    datasets: [
      {
        label: 'CPU Usage %',
        data: Array(30).fill(0),
        borderColor: '#64FFDA',
        backgroundColor: 'rgba(100, 255, 218, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('systemStats', (data) => {
      if (data) {
        setSystemStats({
          cpu: data.cpu ?? 0,
          memory: {
            total: data.memory?.total ?? 1,
            used: data.memory?.used ?? 0,
            free: data.memory?.free ?? 0
          },
          network: {
            rx_sec: data.network?.rx_sec ?? 0,
            tx_sec: data.network?.tx_sec ?? 0
          },
          disk: {
            size: data.disk?.size ?? 1,
            used: data.disk?.used ?? 0,
            free: data.disk?.free ?? 0
          },
          processes: data.processes?.list ?? []
        });
        
        setChartData(prev => ({
          labels: [...prev.labels.slice(1), new Date().toLocaleTimeString()],
          datasets: [{
            ...prev.datasets[0],
            data: [...prev.datasets[0].data.slice(1), data.cpu ?? 0]
          }]
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getPercentage = (used: number, total: number) => {
    if (!total) return 0;
    return (used / total) * 100;
  };

  return (
    <div className="relative min-h-screen">
      <div className="space-y-6 animate-fade-in pr-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Usage Card */}
          <div className="card-gradient p-6 rounded-lg shadow-lg hover-card">
            <h3 className="text-lg font-semibold mb-2 text-blue-accent-500">CPU Usage</h3>
            <p className="text-3xl font-bold text-white animate-pulse-slow">
              {(systemStats.cpu || 0).toFixed(1)}%
            </p>
          </div>

          {/* Memory Usage Card */}
          <div className="card-gradient p-6 rounded-lg shadow-lg hover-card">
            <h3 className="text-lg font-semibold mb-2 text-blue-accent-500">Memory Usage</h3>
            <p className="text-3xl font-bold text-white animate-pulse-slow">
              {getPercentage(systemStats.memory.used, systemStats.memory.total).toFixed(1)}%
            </p>
          </div>

          {/* Network Usage Card */}
          <div className="card-gradient p-6 rounded-lg shadow-lg hover-card">
            <h3 className="text-lg font-semibold mb-2 text-blue-accent-500">Network</h3>
            <div className="text-white">
              <p>↓ {((systemStats.network.rx_sec || 0) / 1024 / 1024).toFixed(2)} MB/s</p>
              <p>↑ {((systemStats.network.tx_sec || 0) / 1024 / 1024).toFixed(2)} MB/s</p>
            </div>
          </div>

          {/* Disk Usage Card */}
          <div className="card-gradient p-6 rounded-lg shadow-lg hover-card">
            <h3 className="text-lg font-semibold mb-2 text-blue-accent-500">Disk Usage</h3>
            <p className="text-3xl font-bold text-white animate-pulse-slow">
              {getPercentage(systemStats.disk.used, systemStats.disk.size).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* CPU Usage Chart */}
        <div className="bg-navy-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-accent-500">CPU Usage Over Time</h3>
          <div className="h-64">
            <Line 
              data={chartData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(100, 255, 218, 0.1)'
                    },
                    ticks: {
                      color: '#A8B2D1'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(100, 255, 218, 0.1)'
                    },
                    ticks: {
                      color: '#A8B2D1'
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#A8B2D1'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Fixed Chatbot */}
      <div className="fixed top-24 right-4 w-[380px] animate-slide-in">
        <ProcessChatbot systemData={systemStats} />
      </div>
    </div>
  );
};

export default Dashboard;