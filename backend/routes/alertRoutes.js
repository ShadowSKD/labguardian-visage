const {
    reportAlert,
    getAlerts,
} = require('../controllers/alertController')

const { isLogin } = require('../middleware/auth_middleware')

const { Router } = require('express')

const router = Router()

router.post('/:labCode/:clientId', reportAlert)
router.get('/:labCode', isLogin, getAlerts)


module.exports = router