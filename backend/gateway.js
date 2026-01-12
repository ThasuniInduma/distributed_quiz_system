import express from 'express';
import httpProxy from 'http-proxy-middleware';
import 'dotenv/config';

const app = express();
const gatewayPort = process.env.GATEWAY_PORT || 3000;

// Service Registry - Keeps track of running server instances
const serviceRegistry = {
  servers: [],
  currentIndex: 0
};

// Server health check
app.get('/health', (req, res) => {
  res.json({ status: 'Gateway OK', activeServers: serviceRegistry.servers.length });
});

// Register a new server
app.post('/register', express.json(), (req, res) => {
  const { port, serverId } = req.body;
  const serverUrl = `http://localhost:${port}`;
  
  // Check if server already registered
  const exists = serviceRegistry.servers.find(s => s.port === port);
  if (exists) {
    return res.json({ success: false, message: 'Server already registered' });
  }
  
  serviceRegistry.servers.push({ port, serverId, url: serverUrl, active: true });
  console.log(`✓ Server registered on port ${port} (ID: ${serverId})`);
  res.json({ 
    success: true, 
    message: `Server ${serverId} registered`,
    totalServers: serviceRegistry.servers.length
  });
});

// Deregister a server
app.post('/deregister', express.json(), (req, res) => {
  const { port } = req.body;
  serviceRegistry.servers = serviceRegistry.servers.filter(s => s.port !== port);
  console.log(`✗ Server deregistered from port ${port}`);
  res.json({ success: true, totalServers: serviceRegistry.servers.length });
});

// Get server list
app.get('/servers', (req, res) => {
  res.json({ servers: serviceRegistry.servers });
});

// Load balancer - Round Robin
function getNextServer() {
  if (serviceRegistry.servers.length === 0) {
    return null;
  }
  const server = serviceRegistry.servers[serviceRegistry.currentIndex];
  serviceRegistry.currentIndex = (serviceRegistry.currentIndex + 1) % serviceRegistry.servers.length;
  return server;
}

// Proxy middleware for API routes
app.use('/api', (req, res, next) => {
  const server = getNextServer();
  
  if (!server) {
    return res.status(503).json({ 
      success: false, 
      message: 'No servers available. Please try again later.' 
    });
  }
  
  const proxy = httpProxy.createProxyMiddleware({
    target: server.url,
    changeOrigin: true,
    logLevel: 'warn'
  });
  
  console.log(`[GATEWAY] Route to: ${server.url} (Server ID: ${server.serverId})`);
  proxy(req, res, next);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(gatewayPort, () => {
  console.log(`
╔════════════════════════════════════════╗
║   DISTRIBUTED SYSTEM - API GATEWAY    ║
║   Gateway running on port: ${gatewayPort}       ║
║   Load Balancing: Round Robin          ║
╚════════════════════════════════════════╝
  `);
});

export default app;
