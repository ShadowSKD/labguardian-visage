const { logAlert, getAlerts } = require('../services/alertStore')
const { getClient } = require('../services/clientStore')

exports.reportAlert = (req, res) => {
    const { labCode, clientId } = req.params
    const { message } = req.body

    const client = getClient(clientId)
    if (!client) {
        return res.status(404).json({ message: 'Client not found' })
    }
    
    const status = getAlerts(labCode)

    if (!status) {
        return res.status(400).json({ message: "Exam not started." })
    }

    const success = logAlert(labCode, { clientId, alertMsg: message, alertType:"malpractice", alertTS: Date.now() })

    if (!success) {
        return res.status(500).json({ message: 'Failed to log alert' })
    }
    
    if (client.status !== 'malpractice') {
        client.status = 'malpractice'
        return res.status(403).json({ message: 'Client is marked as malpractice' })
    }

}

exports.getAlerts = (req, res) => {
    const { labCode } = req.params
    const alerts = getAlerts(labCode)

    if (!alerts) {
        return res.status(404).json({ message: 'No alerts found for this lab' })
    }

    res.status(200).json(alerts)
}