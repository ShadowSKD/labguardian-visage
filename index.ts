import { serve } from 'bun'
import fs from 'fs'

const PORT = 5000
const LOG_FILE = 'admin_logs.json'
let logs = []

// Load existing logs on startup
try {
    logs = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(line => line).map(line => JSON.parse(line))
} catch {}

function logAlert(entry: { type: string; message: string; timestamp: number }) {
    logs.push(entry)
    fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', err => {
        if (err) console.error('Failed to write log:', err)
    })
}

serve({
    port: PORT,
    websocket: {
        open: (ws) => console.log('WebSocket connection opened'),
        message: (ws, message) => console.log('WebSocket message received:', message),
        close: (ws) => console.log('WebSocket connection closed'),
    },
    fetch(req) {
        const url = new URL(req.url)
        if (req.method === 'POST' && url.pathname === '/alert') {
            return req.json().then(({ alert }) => {
                if (alert) {
                    console.log('ALERT:', alert)
                    logAlert({ type: 'alert', message: alert, timestamp: Date.now() })
                }
                const clientLogs: string[] = []; // Define clientLogs
                clientLogs.forEach((log: string) => logAlert(JSON.parse(log)))
            })
        } else if (req.method === 'POST' && url.pathname === '/logs') {
            return req.json().then(({ logs: clientLogs }) => {
                if (clientLogs && clientLogs.length) {
                    clientLogs.forEach((log: string) => logAlert(JSON.parse(log)))
                }
                return new Response(null, { status: 200 })
            })
        } else if (req.method === 'GET' && url.pathname === '/logs') {
            return new Response(JSON.stringify(logs), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        return new Response('Not Found', { status: 404 })
    }
})

console.log(`Admin server running on port ${PORT}`)
