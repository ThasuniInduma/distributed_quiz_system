import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import connectDB from './config/mongodb.js';
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import quizRouter from './routes/quizRoute.js';
import studentRouter from './routes/studentRoutes.js';
import { DISTRIBUTED_CONFIG, getCommunicationPort } from './servers-config.js';

// Get server ID from environment or command line
const serverId = process.env.SERVER_ID || process.argv[2] || 'server-1';
const serverInstance = process.argv[3] || '0';
const port = DISTRIBUTED_CONFIG.basePort + parseInt(serverInstance);
const commPort = getCommunicationPort(port);
const gatewayUrl = `http://localhost:${DISTRIBUTED_CONFIG.gatewayPort}`;

const app = express();

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${serverId}] ${req.method} ${req.path}`);
  next();
});

// ==================== DATABASE ====================
connectDB();

// ==================== ROUTES ====================
app.get('/', (req, res) => res.send(`API Working - Server: ${serverId} (Port: ${port})`));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/student", studentRouter);

// Server info endpoint
app.get('/server-info', (req, res) => {
  res.json({
    serverId,
    port,
    communicationPort: commPort,
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ==================== SERVER STARTUP ====================
let registrationAttempts = 0;
const maxRetries = 5;

async function registerWithGateway() {
  try {
    const response = await axios.post(`${gatewayUrl}/register`, {
      port,
      serverId,
      instance: serverInstance
    });
    
    if (response.data.success) {
      console.log(`✓ Successfully registered with Gateway (${response.data.totalServers} servers active)`);
      return true;
    }
  } catch (error) {
    registrationAttempts++;
    if (registrationAttempts < maxRetries) {
      console.log(`⟳ Retrying registration with Gateway (attempt ${registrationAttempts}/${maxRetries})...`);
      setTimeout(registerWithGateway, 2000);
    } else {
      console.log(`✗ Failed to register with Gateway after ${maxRetries} attempts. Running standalone.`);
    }
  }
  return false;
}

// Start server
app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════╗
║    DISTRIBUTED SYSTEM - SERVER NODE   ║
║    Server ID: ${serverId.padEnd(25)} ║
║    Port: ${port.toString().padEnd(31)} ║
║    Communication Port: ${commPort.toString().padEnd(19)} ║
╚════════════════════════════════════════╝
  `);
  
  // Register with gateway
  setTimeout(registerWithGateway, 500);
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', async () => {
  console.log(`\n[${serverId}] Shutting down gracefully...`);
  
  try {
    await axios.post(`${gatewayUrl}/deregister`, { port });
    console.log(`[${serverId}] Deregistered from Gateway`);
  } catch (error) {
    console.log(`[${serverId}] Could not deregister (Gateway offline?)`);
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log(`\n[${serverId}] Shutting down...`);
  
  try {
    await axios.post(`${gatewayUrl}/deregister`, { port });
  } catch (error) {
    // Gateway might be offline
  }
  
  process.exit(0);
});

export default app;
