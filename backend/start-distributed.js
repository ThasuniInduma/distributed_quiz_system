import { spawn } from 'child_process';
import axios from 'axios';
import { DISTRIBUTED_CONFIG, getServerPorts } from './servers-config.js';

console.log(`
╔════════════════════════════════════════════════════════╗
║   DISTRIBUTED QUIZ SYSTEM - STARTUP MANAGER           ║
║   Starting ${DISTRIBUTED_CONFIG.serverCount} server instances...           ║
╚════════════════════════════════════════════════════════╝
`);

// Store child processes
const serverProcesses = [];

// Start API Gateway
console.log(`\n[1/2] Starting API Gateway on port ${DISTRIBUTED_CONFIG.gatewayPort}...`);
const gatewayProcess = spawn('node', ['gateway.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: { ...process.env, GATEWAY_PORT: DISTRIBUTED_CONFIG.gatewayPort }
});

serverProcesses.push(gatewayProcess);

// Wait for gateway to start
await new Promise(resolve => setTimeout(resolve, 1500));

// Start backend servers
console.log(`\n[2/2] Starting ${DISTRIBUTED_CONFIG.serverCount} backend server instances...`);

for (let i = 0; i < DISTRIBUTED_CONFIG.serverCount; i++) {
  const port = DISTRIBUTED_CONFIG.basePort + i;
  const serverId = `server-${i + 1}`;
  
  console.log(`   └─ Starting ${serverId} on port ${port}...`);
  
  const serverProcess = spawn('node', ['distributed-server.js', serverId, i.toString()], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  
  serverProcesses.push(serverProcess);
  
  // Stagger server starts
  await new Promise(resolve => setTimeout(resolve, 500));
}

// Display connection info
console.log(`
╔════════════════════════════════════════════════════════╗
║              SYSTEM READY                              ║
├────────────────────────────────────────────────────────┤
║  API Gateway:        http://localhost:${DISTRIBUTED_CONFIG.gatewayPort}      ║
║  Backend Servers:    http://localhost:${DISTRIBUTED_CONFIG.basePort}-${DISTRIBUTED_CONFIG.basePort + DISTRIBUTED_CONFIG.serverCount - 1}     ║
║  Total Instances:    ${DISTRIBUTED_CONFIG.serverCount}                                 ║
║  Load Balancing:     ${DISTRIBUTED_CONFIG.loadBalancing}                    ║
│                                                         │
│  Update your Frontend to use:                          │
│  Backend URL: http://localhost:${DISTRIBUTED_CONFIG.gatewayPort}/api        │
╚════════════════════════════════════════════════════════╝
`);

// Handle shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down all servers...');
  
  for (const proc of serverProcesses) {
    proc.kill('SIGTERM');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  process.exit(0);
});
