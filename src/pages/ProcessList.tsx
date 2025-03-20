import React, { useEffect, useState } from 'react';
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
      setProcesses(data.processes.list);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredProcesses = processes.filter((process) =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg animate-fade-in">
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
                        className="bg-blue-500 h-2 rounded-full"
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
                        className="bg-green-500 h-2 rounded-full"
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