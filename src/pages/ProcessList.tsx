import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface Process {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  user: string;
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

  const filteredProcesses = processes.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-navy-800 rounded-lg shadow-lg animate-fade-in">
      <div className="p-4 border-b border-navy-700">
        <input
          type="text"
          placeholder="Search processes..."
          className="w-full px-4 py-2 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-accent-500 focus:border-transparent transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-navy-700">
          <thead className="bg-navy-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-accent-500 uppercase tracking-wider">PID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-accent-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-accent-500 uppercase tracking-wider">CPU %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-accent-500 uppercase tracking-wider">Memory %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-accent-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700">
            {filteredProcesses.map((process, idx) => (
              <tr 
                key={process.pid}
                className="hover:bg-navy-700 transition-colors duration-200 animate-slide-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{process.pid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-accent-500">{process.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{process.cpu.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{process.mem.toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{process.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessList;