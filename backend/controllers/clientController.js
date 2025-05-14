const { addClient, getClient, updateHeartbeat, getAllClients } = require('../services/clientStore')
const { createAlert, getAlerts, startExam, endExam } = require('../services/alertStore')
const User = require('../models/userModel');
const Lab = require('../models/labModel');
const { startInactivityMonitor } = require("../services/heartbeatService");


// Function to generate a unique client ID based on the lab code and client name
const generateClientID = (clientName, labCode) => {
    const hash = require('crypto').createHash('sha256')
        .update(`${labCode}-${clientName}`)
        .digest('hex')

    return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`
}

// Function to generate log File when ending
const generateExamLog = (alertObj) => {
    return JSON.stringify(alertObj)
}

exports.createExam = async (req,res) => {
    const { examName, labCode, UserID } = req.body;

    if (!examName || !labCode || !UserID) {
        return res.status(400).json({ message: 'Exam name and lab code are required' });
    }
    let UserName;
    try {
        const user = await User.findById(UserID);
        UserName = user.name;
    } catch(error) {
        return res.status(400).json({ message: 'User Not Found.', error})
    }
    const examID = generateClientID(examName, labCode); // Generate a unique exam ID
    const status = createAlert(labCode, { examName, examID, UserID, UserName });
    const lab = await Lab.updateOne({labCode},{$set:{labLock:true}});
    
    if (!status) {
        return res.status(400).json({ message: 'Exam Creation failed. Check whether lab is occupied or not. If not occupied, contact administrator clean lab status.'})
    }
    return res.status(200).json({ message: "Exam creation successful.", examID})

}

exports.getAllClients = (req, res) => {
    const { labcode } = req.params;

    const clients = getAllClients(labcode);

    return res.status(200).json(clients);
}

exports.startExam = (req,res) => {
    const { labCode } = req.body;

    if (!labCode) {
        return res.status(400).json({ message: 'Lab code are required' });
    }
    startExam(labCode);
    startInactivityMonitor()

    return res.status(200).json({ message: "Started" });   
}

exports.endExam = async (req, res) => {
    const { labCode } = req.body;

    if (!labCode) {
        return res.status(400).json({ message: 'Lab code are required' });
    }

    const alertObj = getAlerts(labCode)
    const logFile = generateExamLog(alertObj)
    const lab = await Lab.updateOne({labCode},{$set:{labLock:false}});

    endExam(labCode); 
    res.status(200).json({ message: 'Exam ended successfully', logFile });
    
}

exports.registerClient = (req, res) => {
    const { clientName, labCode } = req.body;

    if (!clientName || !labCode) {
        return res.status(400).json({ message: 'Client name and lab code are required' });
    }
    
    const status = getAlerts(labCode)

    if (!status) {
        return res.status(400).json({ message: "Exam not started." })
    }
    
    if (status.lock) {
        return res.status(400).json({ message: "Exam already started. Please try again later." });
    }

    const clientId = generateClientID(clientName,labCode); // Generate a unique client ID

    // Check if the client already exists
    const existingClient = getClient(clientId);
    if (existingClient) {
        return res.status(409).json({ message: 'Client already registered', clientId });
    }

    const newClient = {
        clientId,
        clientName,
        labCode,
        lastHeartbeat: Date.now(),
        status: 'active'
    }

    // Store the client in the database or in-memory store
    try {
        addClient(newClient);
        res.status(201).json({ message: 'Client registered successfully', clientId });
    } catch (error) {
        res.status(500).json({ message: 'Error registering client', error: error.message });
    }

}

exports.forceClient = (req, res) => {
    const { clientId } = req.body;

    if (!clientId) {
        return res.status(400).json({ message: 'Client ID is required' });
    }

    // Check if the client exists
    const existingClient = getClient(clientId);
    if (!existingClient) {
        return res.status(404).json({ message: 'Client not found' });
    }

    // Mark the client as inactive
    existingClient.status = 'active';
    updateHeartbeat(clientId); // Update the heartbeat timestamp

    res.status(200).json({ message: 'Client marked as active', clientId });
}

exports.sendHeartbeat = (req, res) => {
    const { clientId  } = req.body;

    updateHeartbeat(clientId); // Update the heartbeat timestamp
    res.status(200).json({ message: 'OK'});
}