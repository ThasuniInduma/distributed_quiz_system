// Distributed System Configuration
// This file defines how many server instances to run

export const DISTRIBUTED_CONFIG = {
  // Number of backend server instances
  serverCount: 3,
  
  // Base port (servers will run on 4000, 4001, 4002, etc.)
  basePort: 4000,
  
  // Gateway port
  gatewayPort: 3000,
  
  // Server registration timeout (ms)
  registrationTimeout: 5000,
  
  // Load balancing strategy
  loadBalancing: 'round-robin', // Options: 'round-robin', 'least-connections', 'random'
  
  // Enable server-to-server sync
  enableSync: true,
  
  // Server communication port offset
  communicationPortOffset: 5000 // Servers will use 5000, 5001, 5002 for inter-server communication
};

export const getServerPorts = () => {
  const ports = [];
  for (let i = 0; i < DISTRIBUTED_CONFIG.serverCount; i++) {
    ports.push(DISTRIBUTED_CONFIG.basePort + i);
  }
  return ports;
};

export const getCommunicationPort = (serverPort) => {
  const offset = serverPort - DISTRIBUTED_CONFIG.basePort;
  return DISTRIBUTED_CONFIG.communicationPortOffset + offset;
};
