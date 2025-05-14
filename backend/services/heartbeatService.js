const clients = require('./clientStore')
const INACTIVE_TIMEOUT = 1000 * 15; // 15 seconds
const INACTIVE_CHECK_INTERVAL = 1000 * 5; // 5 seconds
const { logAlert, getAlerts } = require('./alertStore')

exports.startInactivityMonitor = () => {
    return setInterval(() => {
        const now = Date.now();
        for (const client of clients.getAllClients()) {
            if (now - client.lastHeartbeat > INACTIVE_TIMEOUT && client.status === 'active' && getAlerts(client.labCode)?.lock) {
                clients.markClientAsInactive(client.clientId);
                logAlert(client.labCode, {
                    clientId: client.clientId,
                    alertMsg: 'Client marked as inactive',
                    alertType: 'inactive',
                    alertTS: Date.now()
                });
                // console.log(`Client ${clientId} marked as inactive`);
            } 
        }
    },INACTIVE_CHECK_INTERVAL)
}