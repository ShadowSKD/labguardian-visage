const clients = new Map();

/**
 * Adds a new client to the in-memory store.
 * @param {Object} client - The client object containing client details.
 * @param {string} client.clientId - The unique ID of the client.
 * @param {string} client.clientName - The name of the client.
 * @param {string} client.labCode - The lab code the client belongs to.
 * @param {number} client.lastHeartbeat - The timestamp of the last heartbeat.
 * @param {string} client.status - The status of the client (e.g., active, inactive).
 * @throws {Error} - Throws an error if any required field is missing.
 */
exports.addClient = (client) => {
    const { clientId, clientName, labCode, lastHeartbeat, status } = client;
    if (!clientId || !clientName || !labCode || !lastHeartbeat || !status) {
        throw new Error('Client ID, name, and lab code are required');
    }
    clients.set(clientId, { clientId, clientName, labCode, lastHeartbeat, status });
};

/**
 * Retrieves a client by their unique ID.
 * @param {string} clientId - The unique ID of the client.
 * @returns {Object|null} - Returns the client object if found, otherwise null.
 */
exports.getClient = (clientId) => {
    return clients.get(clientId);
};

/**
 * Retrieves all clients or clients filtered by a specific lab code.
 * @param {string|null} labCode - The lab code to filter clients by. If null, returns all clients.
 * @returns {Array<Object>} - Returns an array of client objects.
 */
exports.getAllClients = (labCode = null) => {
    if (!labCode) return Array.from(clients.values());
    return Array.from(clients.values()).filter(client => client.labCode === labCode);
};

/**
 * Updates the heartbeat timestamp for a specific client.
 * @param {string} clientId - The unique ID of the client.
 */
exports.updateHeartbeat = (clientId) => {
    const client = clients.get(clientId);
    if (client) {
        client.lastHeartbeat = Date.now();
        clients.set(clientId, client);
    }
};

/**
 * Marks a client as inactive.
 * @param {string} clientId - The unique ID of the client.
 */
exports.markClientAsInactive = (clientId) => {
    const client = clients.get(clientId);
    if (client) {
        client.status = 'inactive';
        clients.set(clientId, client);
    }
};

/**
 * Removes all clients associated with a specific lab code.
 * @param {string} labCode - The lab code to remove clients from.
 */
exports.removeClients = (labCode) => {
    if (!labCode) return;
    for (const [clientId, client] of clients.entries()) {
        if (client.labCode === labCode) {
            clients.delete(clientId);
        }
    }
};

// module.exports = clients