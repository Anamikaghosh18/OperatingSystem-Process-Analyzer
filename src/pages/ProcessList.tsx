import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Cpu, MemoryStick } from 'lucide-react'; // Icons for CPU and Memory

interface Process {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
}

const ProcessList = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('systemStats', (data) => {
      if (data && data.processes && Array.isArray(data.processes.list)) {
        setProcesses(data.processes.list);
      } else {
        console.error('Invalid processes data received:', data);
        setProcesses([]); // Fallback to an empty array
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredProcesses = processes.filter((process) =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to determine progress bar color based on usage
  const getProgressBarColor = (usage: number) => {
    if (usage > 80) return 'bg-red-500'; // High usage
    if (usage > 50) return 'bg-yellow-500'; // Moderate usage
    return 'bg-green-500'; // Low usage
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg animate-fade-in">
      {/* Text Section Below Navbar */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-300">Process List</h1>
        <p className="text-lg text-gray-400 mt-2">
          Monitor and analyze the processes running on your system in real-time. Use the search bar to filter processes by name.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <input
          type="text"
          placeholder="Search processes..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Process Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                PID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                <Cpu className="inline-block w-4 h-4 mr-1" /> CPU %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider">
                <MemoryStick className="inline-block w-4 h-4 mr-1" /> Memory %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProcesses.map((process, idx) => (
              <tr
                key={process.pid}
                className={`${
                  idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
                } hover:bg-gray-700 transition-colors duration-200 animate-slide-in`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {process.pid}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                  {process.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <span>{process.cpu.toFixed(1)}%</span>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`${getProgressBarColor(process.cpu)} h-2 rounded-full`}
                        style={{ width: `${process.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <span>{process.mem.toFixed(1)}%</span>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`${getProgressBarColor(process.mem)} h-2 rounded-full`}
                        style={{ width: `${process.mem}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessList;