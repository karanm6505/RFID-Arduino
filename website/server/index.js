import { createServer } from 'http';
import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

// Create HTTP server
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server default port
    methods: ["GET", "POST"]
  }
});

// Store active serial connection
let activePort = null;
let activeParser = null;

io.on('connection', (socket) => {
  console.log('Client connected');

  // Send connection status on connect
  socket.emit('connectionStatus', { 
    connected: activePort !== null,
    port: activePort ? activePort.path : ''
  });

  // Get available serial ports
  socket.on('getPorts', async () => {
    try {
      const ports = await SerialPort.list();
      socket.emit('ports', ports);
    } catch (error) {
      console.error('Error listing ports:', error);
      socket.emit('error', { message: 'Failed to list ports' });
    }
  });

  // Connect to a port
  socket.on('connectToPort', async ({ port, baudRate }) => {
    try {
      // Disconnect existing connection if any
      if (activePort) {
        await disconnectPort();
      }

      console.log(`Connecting to ${port} at ${baudRate} baud`);
      activePort = new SerialPort({ path: port, baudRate });

      activePort.on('open', () => {
        console.log('Serial port opened');
        
        // Set up parser
        activeParser = activePort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
        
        // Forward serial data to the client
        activeParser.on('data', (data) => {
          io.emit('serialData', data.toString());
        });
        
        // Notify client of connection
        io.emit('connectionStatus', { connected: true, port });
      });

      activePort.on('error', (err) => {
        console.error('Serial port error:', err);
        io.emit('error', { message: `Serial port error: ${err.message}` });
        disconnectPort();
      });

      activePort.on('close', () => {
        console.log('Serial port closed');
        io.emit('connectionStatus', { connected: false, port: '' });
        activePort = null;
        activeParser = null;
      });

    } catch (error) {
      console.error('Connection error:', error);
      socket.emit('error', { message: `Failed to connect: ${error.message}` });
    }
  });

  // Disconnect from port
  socket.on('disconnectPort', () => {
    disconnectPort();
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Helper function to disconnect from port
function disconnectPort() {
  return new Promise((resolve) => {
    if (!activePort) {
      resolve();
      return;
    }
    
    console.log('Disconnecting from port');
    
    if (activeParser) {
      activeParser.removeAllListeners();
      activeParser = null;
    }
    
    activePort.close((err) => {
      if (err) {
        console.error('Error closing port:', err);
      }
      activePort = null;
      io.emit('connectionStatus', { connected: false, port: '' });
      resolve();
    });
  });
}

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await disconnectPort();
  process.exit(0);
});
