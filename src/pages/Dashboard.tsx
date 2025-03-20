import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { io } from 'socket.io-client';
import { Cpu, MemoryStick, HardDrive, Wifi, Activity, Monitor, Clock } from 'lucide-react';
import ProcessChatbot from '../components/ProcessChatbot';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: { total: 1, used: 0, free: 0 },
    network: { rx_sec: 0, tx_sec: 0, total_rx: 0, total_tx: 0 },
    disk: { size: 1, used: 0 },
    processes: [],
    uptime: 0,
    gpu: null, // New GPU stats
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
        fill: true,
      },
    ],
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
            free: data.memory?.free ?? 0,
          },
          network: {
            rx_sec: data.network?.rx_sec ?? 0,
            tx_sec: data.network?.tx_sec ?? 0,
            total_rx: data.network?.total_rx ?? 0,
            total_tx: data.network?.total_tx ?? 0,
          },
          disk: {
            size: data.disk?.size ?? 1,
            used: data.disk?.used ?? 0,
          },
          processes: data.processes?.list ?? [],
          uptime: data.uptime ?? 0,
          gpu: data.gpu ?? null, // GPU stats
        });

        setChartData((prev) => ({
          labels: [...prev.labels.slice(1), new Date().toLocaleTimeString()],
          datasets: [
            {
              ...prev.datasets[0],
              data: [...prev.datasets[0].data.slice(1), data.cpu ?? 0],
            },
          ],
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

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-300">
      {/* Header Section */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-blue-400">System Performance Dashboard</h1>
        <p className="text-lg text-gray-400 mt-2">
          Real-time insights into your system's performance and resource usage.
        </p>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        {/* CPU Usage */}
        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
          <Cpu className="text-blue-400 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold text-white">CPU Usage</h3>
          <CircularProgressbar
            value={systemStats.cpu}
            text={`${systemStats.cpu.toFixed(1)}%`}
            styles={buildStyles({
              textColor: '#FFFFFF',
              pathColor: '#64FFDA',
              trailColor: 'rgba(100, 255, 218, 0.2)',
            })}
          />
        </div>

        {/* Memory Usage */}
        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
          <MemoryStick className="text-pink-400 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold text-white">Memory Usage</h3>
          <CircularProgressbar
            value={getPercentage(systemStats.memory.used, systemStats.memory.total)}
            text={`${getPercentage(systemStats.memory.used, systemStats.memory.total).toFixed(1)}%`}
            styles={buildStyles({
              textColor: '#FFFFFF',
              pathColor: '#FF6384',
              trailColor: 'rgba(255, 99, 132, 0.2)',
            })}
          />
        </div>

        {/* Network Usage */}
        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
          <Wifi className="text-green-400 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold text-white">Network Usage</h3>
          <p className="text-sm text-gray-200">
            ↓ {((systemStats.network.rx_sec || 0) / 1024 / 1024).toFixed(2)} MB/s
          </p>
          <p className="text-sm text-gray-200">
            ↑ {((systemStats.network.tx_sec || 0) / 1024 / 1024).toFixed(2)} MB/s
          </p>
        </div>

        

        {/* Disk Usage */}
        <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
          <HardDrive className="text-purple-400 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold text-white">Disk Usage</h3>
          <CircularProgressbar
            value={getPercentage(systemStats.disk.used, systemStats.disk.size)}
            text={`${getPercentage(systemStats.disk.used, systemStats.disk.size).toFixed(1)}%`}
            styles={buildStyles({
              textColor: '#FFFFFF',
              pathColor: '#36A2EB',
              trailColor: 'rgba(54, 162, 235, 0.2)',
            })}
          />
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-8">
        {/* CPU Usage Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">CPU Usage Over Time</h3>
          <div className="h-64">
            <Line
              data={chartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(100, 255, 218, 0.1)',
                    },
                    ticks: {
                      color: '#A8B2D1',
                    },
                  },
                  x: {
                    grid: {
                      color: 'rgba(100, 255, 218, 0.1)',
                    },
                    ticks: {
                      color: '#A8B2D1',
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#A8B2D1',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Memory Usage Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-pink-400">Memory Usage Over Time</h3>
          <div className="h-64">
            <Line
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: 'Memory Usage %',
                    data: chartData.datasets[0].data.map(() =>
                      getPercentage(systemStats.memory.used, systemStats.memory.total)
                    ),
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(100, 255, 218, 0.1)',
                    },
                    ticks: {
                      color: '#A8B2D1',
                    },
                  },
                  x: {
                    grid: {
                      color: 'rgba(100, 255, 218, 0.1)',
                    },
                    ticks: {
                      color: '#A8B2D1',
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#A8B2D1',
                    },
                  },
                },
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