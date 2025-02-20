import { serve } from 'bun'
import fs from 'fs'
import crypto from 'crypto'

const PORT = 5000
const LOG_FILE = 'admin_logs.json'
const CLIENTS_FILE = 'clients.json'
const ACTIVE_CLIENTS: { [client_id: string]: number } = {}

interface LogEntry {
    type: string
    message: string
    timestamp: string
}

interface Clients {
    [username: string]: { hostname: string, client_id: string }
}

let logs: LogEntry[] = []
let clients: Clients = {}

// Load existing logs and clients on startup
try {
    logs = fs.readFileSync(LOG_FILE, 'utf8')
        .split('\n')
        .filter(line => line)
        .map(line => JSON.parse(line))
} catch (error) {
    logs = []
}

try {
    clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf8'))
} catch (error) {
    clients = {}
}

function logAlert(entry: LogEntry) {
    logs.push(entry)
    fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', err => {
        if (err) console.error('Failed to write log:', err)
    })
}

function saveClients() {
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2))
}

setInterval(() => {
    const now = Date.now()
    for (const [client_id, lastActive] of Object.entries(ACTIVE_CLIENTS)) {
        if (now - lastActive > 20000) {
            logAlert({ type: 'alert', message: `Client ${client_id} is inactive`, timestamp: now.toString() })
            delete ACTIVE_CLIENTS[client_id]
        }
    }
}, 10000)

serve({
    port: PORT,
    websocket: {
        open: (ws) => console.log('WebSocket connection opened'),
        message: (ws, message) => console.log('WebSocket message received:', message.toString()),
        close: (ws) => console.log('WebSocket connection closed'),
    },
    fetch(req) {
        const url = new URL(req.url)
        
        if (req.method === 'POST' && url.pathname === '/alert') {
            return req.json().then(({ alert, client_username }: { alert: string, client_username: string }) => {
                if (alert) {
                    console.log('ALERT from ',client_username,':', alert)
                    logAlert({ type: 'alert', message: alert, timestamp: Date.now().toString() })
                }
                return new Response(null, { status: 200 })
            })
        } 
                
        if (req.method === 'POST' && url.pathname === '/logs') {
            return req.json().then(({ logs: clientLogs }: { logs: string[] }) => {
                if (clientLogs && clientLogs.length) {
                    clientLogs.forEach(log => logAlert(JSON.parse(log)))
                }
                return new Response(null, { status: 200 })
            })
        }
        
        if (req.method === 'GET' && url.pathname === '/isserveractive') {
            return new Response(null, { status: 200 })
        }

        if (req.method === 'POST' && url.pathname === '/heartbeat') {
            return req.json().then(({ client_id }: { client_id: string }) => {
                if (client_id && clients[client_id]) {
                    ACTIVE_CLIENTS[client_id] = Date.now()
                }
                return new Response(null, { status: 200 })
            })
        }

        if (req.method === 'GET' && url.pathname === '/logs') {
            return new Response(JSON.stringify(logs), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        if (req.method === 'POST' && url.pathname === '/register') {
            return req.json().then(({ username, hostname }: { username: string, hostname: string }) => {
                if (!username && !hostname) {
                    return new Response('Missing username and hostname', { status: 400 })
                }
                
                for (const [existingUsername, client] of Object.entries(clients)) {
                    if (client.hostname === hostname) {
                        // Update the username for the existing client
                        delete clients[existingUsername]
                        clients[username] = { hostname, client_id: client.client_id }
                        saveClients()
                        return new Response(JSON.stringify({ client_id: client.client_id }), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        })
                    }
                }

                if (clients[username]) {
                    return new Response('Username already exists', { status: 400 })
                }
                
                const client_id = crypto.randomUUID()
                clients[username] = { hostname, client_id }
                console.log('Client registered:', username, hostname, client_id)
                saveClients()
                
                return new Response(JSON.stringify({ client_id }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            })
        }
        
        return new Response('Not Found', { status: 404 })
    }
})

console.log(`Admin server running on port ${PORT}`)
