import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import si from 'systeminformation';
import { exec } from 'child_process';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

app.post('/kill-process', (req, res) => {
  const { pid } = req.body;

  if (!pid) {
    return res.status(400).send({ error: 'PID is required' });
  }

  // Kill the process using the `taskkill` command (Windows)
  exec(`taskkill /PID ${pid} /F`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error killing process ${pid}:`, stderr);
      return res.status(500).send({ error: `Failed to kill process ${pid}` });
    }

    console.log(`Process ${pid} killed successfully.`);
    res.status(200).send({ message: `Process ${pid} killed successfully.` });
  });
});

// Emit system stats every second
setInterval(async () => {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const network = await si.networkStats();
    const disk = await si.fsSize();
    const processes = await si.processes();
    const uptime = process.uptime();

    io.emit('systemStats', {
      cpu: cpu.currentLoad,
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
      },
      network: network[0],
      disk: disk[0],
      processes: processes.list || [], // Ensure `list` is an array
      uptime: uptime,
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
  }
}, 1000);

io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});