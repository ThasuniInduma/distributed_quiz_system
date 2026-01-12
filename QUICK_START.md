# Quick Start - Distributed Quiz System

## 🚀 Start the Distributed System (3 servers + gateway)

### Option 1: Automated Start (Recommended)
```bash
cd backend
npm run distributed
```

This starts:
- 1 API Gateway on port 3000
- 3 Backend Servers on ports 4000, 4001, 4002
- All servers automatically register with the gateway

### Option 2: Manual Start

**Terminal 1 - Start Gateway:**
```bash
cd backend
npm run gateway
```

**Terminal 2, 3, 4 - Start Servers (in separate terminals):**
```bash
npm run server-1
npm run server-2
npm run server-3
```

---

## 🧪 Test the System

### Check Gateway Health
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status": "Gateway OK", "activeServers": 3}
```

### View Active Servers
```bash
curl http://localhost:3000/servers
```

### Test Load Balancing
```bash
curl http://localhost:3000/api/
```

Run this multiple times and you'll see responses from different servers showing load balancing in action.

---

## 💻 Start Frontend

**Terminal (after starting backend):**
```bash
cd frontend
npm run dev
```

Frontend will be at: `http://localhost:5173` or `http://localhost:5174`

---

## 📋 System Status

When running, you'll see:

**Gateway Output:**
```
╔════════════════════════════════════════╗
║   DISTRIBUTED SYSTEM - API GATEWAY    ║
║   Gateway running on port: 3000       ║
║   Load Balancing: Round Robin          ║
╚════════════════════════════════════════╝
```

**Server Output:**
```
╔════════════════════════════════════════╗
║    DISTRIBUTED SYSTEM - SERVER NODE   ║
║    Server ID: server-1                ║
║    Port: 4000                         ║
║    Communication Port: 5000           ║
╚════════════════════════════════════════╝
```

---

## ✅ Verify Everything Works

1. **Test Registration:**
   - Go to `http://localhost:5173/register`
   - Create an account
   - Backend server should be automatically assigned by load balancer

2. **Test Login:**
   - Go to `http://localhost:5173/login`
   - Login with created account
   - Request routed to next server in round-robin

3. **Check Server Logs:**
   - Watch terminal to see which server handles each request
   - Example: `[server-1] GET /api/auth/login`

---

## 🔧 Configuration

Edit `backend/servers-config.js` to customize:

```javascript
export const DISTRIBUTED_CONFIG = {
  serverCount: 3,              // Add more servers (4, 5, etc.)
  basePort: 4000,              // Starting port
  gatewayPort: 3000,           // Gateway port
  loadBalancing: 'round-robin' // Load balancing strategy
};
```

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `gateway.js` | API Gateway with load balancer |
| `distributed-server.js` | Individual server instance |
| `servers-config.js` | Configuration for all servers |
| `start-distributed.js` | Automated startup manager |
| `server.js` | Original single-server (for reference) |

---

## 🛑 Stopping the System

**If running with `npm run distributed`:**
- Press `Ctrl+C` in the terminal
- All servers automatically deregister from gateway

**If running manually:**
- Press `Ctrl+C` in each terminal
- Servers will gracefully shutdown

---

## 🐛 Troubleshooting

### "Cannot connect to servers" 
- Ensure all 3 servers are running
- Check with: `curl http://localhost:3000/servers`

### Port already in use
- Change `basePort` in `servers-config.js`
- Make sure no other services on ports 3000-4002

### Frontend getting "Login failed"
- Verify frontend is using `http://localhost:3000` (gateway)
- Check browser console for exact error
- Restart frontend: `npm run dev`

### Servers not appearing in gateway list
- Check server logs for error messages
- Ensure gateway started first
- Wait 2 seconds before starting servers

---

## 📊 How Load Balancing Works

```
Request 1 → Gateway → Server 1 (port 4000)
Request 2 → Gateway → Server 2 (port 4001)
Request 3 → Gateway → Server 3 (port 4002)
Request 4 → Gateway → Server 1 (port 4000) [cycles back]
```

Each request is handled by the next server in sequence (round-robin).

---

## 🚀 Next Steps

1. **Add more servers** - Change `serverCount: 5` in config
2. **Add Redis caching** - For distributed session storage
3. **Add health checks** - Automatic server failure detection
4. **Implement sticky sessions** - Keep user on same server
5. **Add monitoring** - Track request counts and response times

---

**Your distributed quiz system is ready!** 🎉
