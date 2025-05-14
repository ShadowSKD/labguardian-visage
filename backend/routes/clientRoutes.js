const {
    registerClient,
    sendHeartbeat,
    createExam,
    startExam,
    endExam,
    getAllClients
} = require('../controllers/clientController')

const { isLogin } = require('../middleware/auth_middleware')

const { Router } = require('express')

const router = Router()

router.post('/createexam', isLogin, createExam)
router.post('/register', registerClient)
router.post('/heartbeat', sendHeartbeat)
router.post('/startexam', isLogin, startExam)
router.post('/endexam', isLogin, endExam)
router.get('/getallclients', isLogin, getAllClients)
router.get('/getallclients/:labcode', isLogin, getAllClients)

module.exports = router