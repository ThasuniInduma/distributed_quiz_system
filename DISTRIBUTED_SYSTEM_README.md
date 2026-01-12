# Distributed Quiz System Architecture

## Overview
This system has been converted to a **distributed architecture** with multiple backend servers, an API Gateway, and load balancing.

## System Components

### 1. **API Gateway** (`gateway.js`)
- **Port:** 3000
- **Role:** Central entry point for all requests
- **Features:**
  - Round-robin load balancing
  - Server registration/deregistration
  - Health monitoring
  - Request routing

### 2. **Backend Servers** (`distributed-server.js`)
- **Ports:** 4000, 4001, 4002 (3 instances by default)
- **Role:** Handle API requests
- **Features:**
  - Automatic gateway registration
  - Graceful shutdown
  - Request logging
  - Server info endpoint

### 3. **Startup Manager** (`start-distributed.js`)
- Orchestrates starting the gateway and all server instances
- Manages process lifecycle
- Displays system information

### 4. **Configuration** (`servers-config.js`)
- Centralized configuration for distributed system
- Easy scaling (change `serverCount`)
- Port management

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React/Vite)                   │
│         http://localhost:5173 or 5174               │
└────────────────────┬────────────────────────────────┘
                     │ All API calls
┌────────────────────▼────────────────────────────────┐
│          API GATEWAY (Port 3000)                     │
│  ├─ Load Balancer (Round Robin)                     │
│  ├─ Service Registry                                │
│  └─ Health Monitor                                  │
└────┬──────────────┬──────────────┬─────────────────┘
     │              │              │
┌────▼────┐  ┌─────▼──────┐  ┌────▼──────┐
│ Server 1 │  │  Server 2  │  │ Server 3  │
│Port 4000 │  │ Port 4001  │  │ Port 4002 │
└────┬────┘  └─────┬──────┘  └────┬──────┘
     │              │              │
     └──────────┬───┴──────────┬───┘
                │              │
         ┌──────▼────────┐  ┌──▼──────────┐
         │  MongoDB      │  │   Redis     │
         │  (Shared DB)  │  │  (Shared    │
         │               │  │   Cache)    │
         └───────────────┘  └─────────────┘
```

## How It Works

### Request Flow
1. **Frontend** sends request to `http://localhost:3000/api/...`
2. **API Gateway** receives request at port 3000
3. **Load Balancer** selects next server (round robin)
4. **Backend Server** processes request
5. **Database** handles data operations (shared MongoDB)
6. **Response** returns through gateway to frontend

### Server Registration
When a backend server starts:
```
1. Server starts on port 4000, 4001, or 4002
2. Connects to MongoDB database
3. Sends registration request to gateway (port 3000)
4. Gateway registers server and updates service registry
5. Gateway begins routing requests to this server
```

### Load Balancing
- **Strategy:** Round Robin
- **How it works:** Each request goes to the next server in sequence
- **Example:** Request 1 → Server1, Request 2 → Server 2, Request 3 → Server 3, Request 4 → Server 1...

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install axios http-proxy-middleware
```

### 2. Update Configuration (Optional)
Edit `servers-config.js` to change:
- Number of servers: `serverCount`
- Base port: `basePort`
- Load balancing strategy: `loadBalancing`

```javascript
export const DISTRIBUTED_CONFIG = {
  serverCount: 3,        // Change to 5 for 5 servers
  basePort: 4000,        // First server port
  gatewayPort: 3000,     // Gateway port
  loadBalancing: 'round-robin'
};
```

### 3. Start the Distributed System
```bash
npm run distributed
```

This will start:
- 1 API Gateway on port 3000
- 3 Backend Servers on ports 4000, 4001, 4002

### 4. Update Frontend Configuration
Change the API endpoint in your frontend from:
```javascript
const backendUrl = 'http://localhost:4000';
```

To:
```javascript
const backendUrl = 'http://localhost:3000'; // Gateway URL
```

Update this in:
- `frontend/src/pages/login.jsx`
- `frontend/src/pages/register.jsx`
- `frontend/src/context/appContext.jsx`
- Frontend `.env` file

## Running Individual Components

### Run Only Gateway
```bash
npm run gateway
```

### Run Individual Servers
```bash
npm run server-1
npm run server-2
npm run server-3
```

### Monitor Gateway
```bash
curl http://localhost:3000/servers
```
Shows active servers and their status.

### Check Server Health
```bash
curl http://localhost:3000/health
```

## Features

✅ **Multi-Server Setup** - 3+ independent backend instances
✅ **Load Balancing** - Automatic request distribution
✅ **Graceful Shutdown** - Servers deregister on shutdown
✅ **Service Registry** - Gateway knows all active servers
✅ **Shared Database** - All servers use same MongoDB
✅ **Server Isolation** - Each server independent process
✅ **Easy Scaling** - Add more servers by changing config

## Scaling Guide

### Add More Servers
1. Update `servers-config.js`:
```javascript
serverCount: 5  // Now 5 servers instead of 3
```

2. Add npm scripts in `package.json`:
```json
"server-4": "node distributed-server.js server-4 3",
"server-5": "node distributed-server.js server-5 4"
```

3. Restart with `npm run distributed`

### Remove Servers
Simply reduce `serverCount` and restart the system.

## Troubleshooting

### Servers not registering with gateway?
- Ensure gateway starts first: `npm run gateway`
- Wait 2 seconds before starting servers
- Check that port 3000 is available

### "No servers available" error?
- Check if all servers are running: `curl http://localhost:3000/servers`
- Verify ports 4000, 4001, 4002 are not in use

### Database connection errors?
- All servers share same MongoDB connection
- Check `.env` file has correct `MONGODB_URI`

## Next Steps (Optional)

1. **Add Caching Layer** - Implement Redis for distributed cache
2. **Implement Sticky Sessions** - Route user to same server
3. **Add Health Checks** - Automatic server failure detection
4. **Metrics & Monitoring** - Request count, response times
5. **Distributed Logging** - Centralized log aggregation
6. **Message Queue** - For async operations (RabbitMQ, Redis)

## Environment Variables

Create a `.env` file in backend with:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net
JWT_SECRET=your_secret_key
NODE_ENV=development
GATEWAY_PORT=3000
```

---

**Your system is now distributed!** 🚀
