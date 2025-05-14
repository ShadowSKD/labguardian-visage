// alertLog-> key: labCode, value: alertObject

/*
alertObject = {
    log: [*list of all alerts in lab*],
    lock: Boolean (*accepting clients*),
    examId,
    examName,
    UserID,
    UserName
}
*/

/*
log = {
    client: '',
    alertMsg,
    alertType,
    alertTS
}
*/


const alertLog = new Map();

const { removeClients  } = require("../services/clientStore");


/**
 * Logs an alert for a specific lab.
 * @param {string} labCode - The unique code of the lab.
 * @param {Object} alert - The alert object containing details of the alert.
 * @param {string} alert.clientId - The ID of the client triggering the alert.
 * @param {string} alert.alertMsg - The message describing the alert.
 * @param {string} alert.alertType - The type of alert (e.g., malpractice, suspicious activity).
 * @param {number} alert.alertTS - The timestamp of the alert.
 * @returns {boolean} - Returns true if the alert was logged successfully, false otherwise.
 */
exports.logAlert = (labCode, alert) => {
    if (!alertLog.has(labCode)) {
        return false;
    }
    const alerts = alertLog.get(labCode);
    if (!alerts.lock) {
        return false;
    }
    alerts.log.push(alert);
    alertLog.set(labCode, alerts);
    return true;
};

/**
 * Retrieves all alerts for a specific lab.
 * @param {string} labCode - The unique code of the lab.
 * @returns {Object|null} - Returns the alert object for the lab, or null if no alerts exist.
 */
exports.getAlerts = (labCode) => {
    if (!alertLog.has(labCode)) {
        return null;
    }
    return alertLog.get(labCode);
};

/**
 * Creates a new alert object for a lab.
 * @param {string} labCode - The unique code of the lab.
 * @param {Object} exam - The exam details.
 * @param {string} exam.examID - The unique ID of the exam.
 * @param {string} exam.examName - The name of the exam.
 * @param {string} exam.UserID - The ID of the user creating the exam.
 * @param {string} exam.UserName - The name of the user creating the exam.
 * @returns {boolean} - Returns true if the alert object was created successfully, false otherwise.
 */
exports.createAlert = (labCode, exam) => {
    if (alertLog.has(labCode)) {
        return false;
    }
    const { examID, examName, UserID, UserName } = exam;
    alertLog.set(labCode, {
        log: [],
        lock: false,
        examID,
        examName,
        UserID,
        UserName
    });
    return true;
};

/**
 * Starts an exam by locking the lab and preventing new clients from joining.
 * @param {string} labCode - The unique code of the lab.
 */
exports.startExam = (labCode) => {
    if (!alertLog.has(labCode)) {
        return;
    }
    const alerts = alertLog.get(labCode);
    alerts.lock = true;
    alertLog.set(labCode, alerts);
    
};

/**
 * Ends an exam by removing the alert object and clearing all clients from the lab.
 * @param {string} labCode - The unique code of the lab.
 */
exports.endExam = (labCode) => {
    if (!alertLog.has(labCode)) {
        return;
    }
    alertLog.delete(labCode);
    removeClients(labCode);
};

module.exports.alertLog;